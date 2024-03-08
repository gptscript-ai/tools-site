package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gptscript-ai/gptscript/pkg/parser"
)

func main() {
	router := gin.Default()
	router.ForwardedByClientIP = true
	router.SetTrustedProxies([]string{"127.0.0.1"})

	// setup middlewares
	router.Use(corsMiddleware())

	// setup routes
	router.POST("/", handleRequest)

	// start server
	log.Fatal(router.Run(":8080"))
}

func handleRequest(c *gin.Context) {
	parsedScript, err := parser.Parse(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing script"})
		return
	}
	c.JSON(http.StatusOK, parsedScript)
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "POST")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	}
}
