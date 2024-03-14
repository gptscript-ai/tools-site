package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/gptscript-ai/gptscript/pkg/builtin"
	"github.com/gptscript-ai/gptscript/pkg/types"
	_ "github.com/lib/pq"
)

func main() {
	dbConnectionString := os.Getenv("DB_URL")
	if dbConnectionString == "" {
		log.Fatal("DB_URL environment variable is not set")
	}

	db, err := sql.Open("postgres", dbConnectionString)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	for _, tool := range builtin.ListTools() {
		toolInArray := []types.Tool{tool}
		toolAsJSON, err := json.Marshal(toolInArray)
		if err != nil {
			log.Fatal(err)
		}

		_, err = db.Exec(`
			INSERT INTO public."ToolEntry" (reference, content, "systemTool", "lastIndexedAt")
			VALUES ($1, $2, $3, NOW())
			ON CONFLICT (reference) DO UPDATE
			SET "content" = $2, "systemTool" = $3, "lastIndexedAt" = NOW()`,
			tool.Name,
			string(toolAsJSON),
			true,
		)

		if err != nil {
			log.Fatal(err)
		}
	}

	fmt.Println("Successfully inserted system tools into the database.")
}
