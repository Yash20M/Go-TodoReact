package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Todo struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Completed bool               `json:"completed"`
	Body      string             `json:"body"`
}

var collection *mongo.Collection

func main() {

	if os.Getenv("ENV") != "production" {

		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal("Error loadingb .env file", err)
		}
	}

	mongoUri := os.Getenv("MONGO_URI")

	clientOptions := options.Client().ApplyURI(mongoUri)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal("Client", err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal("error Ping", err)
	}

	fmt.Println("Connected to MonogoDB successfully✔")

	collection = client.Database("goTodo").Collection("todos")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173/",
		AllowHeaders: "Origin, Content-type,Accept",
	}))

	app.Get("/api/todos", GetTodos)
	app.Post("/api/addTodo", CreateTodos)
	app.Patch("/api/todos/:id", UpdateTodos)
	app.Delete("/api/todos/:id", DeleteTodos)

	if os.Getenv("ENV") == "production" {
		app.Static("/", "./client/dist")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Fatal(app.Listen(":" + port))
}
