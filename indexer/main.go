package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/url"
	"os"
	"time"

	log "github.com/sirupsen/logrus"

	"github.com/gptscript-ai/gptscript/pkg/builtin"
	"github.com/gptscript-ai/gptscript/pkg/types"
	_ "github.com/lib/pq"
)

func main() {
	log.Infof("Starting the indexer at %s", time.Now())

	dbConnectionString := os.Getenv("DB_URL")
	if dbConnectionString == "" {
		log.Fatal("DB_URL environment variable is not set")
	}

	apiURLString := os.Getenv("API_URL")
	if apiURLString == "" {
		log.Fatal("API_URL environment variable is not set")
	}

	apiURL, err := url.Parse(apiURLString)
	if err != nil {
		log.Fatal("Failed to parse api url")
	}
	if apiURL.Scheme == "" {
		apiURL.Scheme = "http"
	}

	db, err := sql.Open("postgres", dbConnectionString)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	insertSystemTools(db)
	reindexRemoteTools(db, apiURL)
}

// insertSystemTools inserts gets all of the current system tools and loads them
// into the database.
func insertSystemTools(db *sql.DB) {
	for _, tool := range builtin.ListTools() {
		toolInArray := []types.Tool{tool}
		toolAsJSON, err := json.Marshal(toolInArray)
		if err != nil {
			log.Error(err)
			continue
		}

		_, err = db.Exec(`
			INSERT INTO public."ToolEntry" (reference, content, "systemTool", description, "lastIndexedAt")
			VALUES ($1, $2, $3, $4, NOW())
			ON CONFLICT (reference) DO UPDATE
			SET "content" = $2, "systemTool" = $3, "description" = $4, "lastIndexedAt" = NOW()`,
			tool.Name,
			string(toolAsJSON),
			true,
			tool.Description,
		)

		if err != nil {
			log.Error(err)
		}
	}
	log.Infof("Successfully inserted system tools into the database.")
}

// reindexRemoteTools reindexes all of the current remote tools in the database. If
// an error occurs, it logs the error and continues to the next tool.
func reindexRemoteTools(db *sql.DB, apiURL *url.URL) {
	rows, err := db.Query(`
		SELECT *
		FROM public."ToolEntry"
		WHERE "systemTool" = false
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			index         string
			reference     string
			content       string
			description   *string
			lastIndexedAt string
			createdAt     string
			systemTool    bool
		)

		err = rows.Scan(&index, &createdAt, &lastIndexedAt, &content, &reference, &systemTool, &description)
		if err != nil {
			log.Fatal(err)
		}

		if systemTool {
			continue
		}

		url := apiURL.JoinPath(reference)
		req, err := http.NewRequest("POST", url.String(), bytes.NewBuffer([]byte{}))
		if err != nil {
			log.Fatal(err)
		}
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			log.Fatal(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			log.Errorf("Error indexing tool %s: %s", reference, resp.Status)
			continue
		}

		_, err = db.Exec(`
			UPDATE public."ToolEntry"
			SET "lastIndexedAt" = NOW()
			WHERE reference = $1`,
			reference,
		)
		if err != nil {
			log.Fatal(err)
		}
	}
	log.Infof("Successfully completed the remote tool reindexing.")
}
