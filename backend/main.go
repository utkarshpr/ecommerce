package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/utkarshpr/ecommerce/database"
	"github.com/utkarshpr/ecommerce/logger"
	repo "github.com/utkarshpr/ecommerce/repositary"
	"github.com/utkarshpr/ecommerce/routes"
)

func main() {

	logger.InitLogger("app.log")

	loadEnvVarible()
	// Initialize MongoDB connection
	database.InitMongoDB()
	r := gin.Default()

	repo.InitRepository()
	gin.SetMode(gin.ReleaseMode)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))
	routes.AuthRoutes(r)
	routes.ProductRoute(r)
	routes.CartRoute(r)
	port := os.Getenv("PORT")
	err := r.Run(port)
	if err != nil {
		logger.LogError("Failed to start server: " + err.Error())
	}
}
func loadEnvVarible() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
}
