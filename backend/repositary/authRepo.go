package repo

import (
	"context"
	"errors"
	"os"

	"time"

	"github.com/golang-jwt/jwt"
	"github.com/utkarshpr/ecommerce/database"
	"github.com/utkarshpr/ecommerce/logger"
	"github.com/utkarshpr/ecommerce/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

// Declare the collection globally, but initialize it after InitMongoDB is called
var userCollection *mongo.Collection
var jwtCollection *mongo.Collection
var productCollection *mongo.Collection

// Initialize userCollection after the MongoDB connection is established
func InitRepository() {
	database.InitMongoDB()

	userCollection = database.GetCollection(os.Getenv("MONGO_TABLE_USER"))
	jwtCollection = database.GetCollection(os.Getenv("MONGO_TABLE_JWT_STORE"))
	productCollection = database.GetCollection(os.Getenv("MONGO_TABLE_PRODUCT"))
	logger.LogInfo("Repository Initialized with MongoDB collections")
}

// InsertUser inserts a new user into the database
func InsertUser(user *models.User) error {
	logger.LogInfo("InsertUser repo:: started ")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"$or": []bson.M{
			{"email": user.Email},
			{"username": user.Username},
		},
	}

	count, err := userCollection.CountDocuments(ctx, filter)
	if err != nil {
		logger.LogError("error in inserting user " + err.Error())
		return err
	}
	if count > 0 {
		return errors.New("email or username already exists")
	}

	_, err = userCollection.InsertOne(ctx, user)
	if err != nil {
		logger.LogError("error in inserting user " + err.Error())
		return err
	}
	logger.LogInfo("InsertUser :: ended ,Successfully inserted user: " + user.Username)
	return nil
}

func IsLoggedinUserExist(user *models.LoginUser) (string, string, error) {
	logger.LogInfo("IsLoggedinUserExist :: started")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find user by email
	var existingUser models.User
	filter := bson.M{"username": user.Username}
	err := userCollection.FindOne(ctx, filter).Decode(&existingUser)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return "", "", errors.New("user not found")
		}
		return "", "", err
	}

	logger.LogInfo("IsLoggedinUserExist :: user fetch from username : " + existingUser.Email)

	// Check if the provided password matches the stored hashed password
	err = CompareHashAndPassword(existingUser.Password, user.Password)

	if err != nil {
		logger.LogError("IsLoggedinUserExist ::invalid password :CompareHashAndPassword ")
		return "", "", errors.New("invalid password")
	}

	logger.LogInfo("IsLoggedinUserExist :: Hashed password check success : ")

	// Generate a JWT token here (you can use any JWT library to generate the token)
	// You can use `jwt-go` or `golang-jwt/jwt` for this purpose.
	token, err := generateJWT(existingUser)
	if err != nil {
		logger.LogError("IsLoggedinUserExist :: Unable to get JWT token ")
		return "", "", err
	}
	refreshtoken, err := generateRefreshTokenJWT(existingUser)
	if err != nil {
		logger.LogError("IsLoggedinUserExist :: Unable to get refresh JWT token  ")
		return "", "", err
	}

	tok, ref, err := InsertJwtTokenForUser(token, refreshtoken, &existingUser)
	if err != nil {
		logger.LogError("IsLoggedinUserExist :: Unable to store JWT token in DB ")
		return "", "", errors.New("unable to store jwt token in db ")
	}
	logger.LogInfo("IsLoggedinUserExist :: ended")
	return tok, ref, nil
}

func generateJWT(user models.User) (string, error) {
	// Create claims with user data
	claims := jwt.MapClaims{
		"user_id":    user.ID.Hex(), // User ID (in case you want to identify the user by ID)
		"username":   user.Username, // User's username
		"First Name": user.FirstName,
		"Last Name":  user.LastName,
		"role":       user.Role,                             // User's email
		"exp":        time.Now().Add(time.Hour * 24).Unix(), // Token expiration time (1 day)
	}

	logger.LogInfo("generateJWT :: claim map formed ")

	// Create a new token with claims and sign it with the secret key
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secretKey := []byte(os.Getenv("JWT_SECRET_KEY"))
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		logger.LogError("generateJWT :: error in  Create a new token with claims and sign it with the secret key" + err.Error())
		return "", err
	}

	return tokenString, nil
}

func generateRefreshTokenJWT(user models.User) (string, error) {
	// Create claims with user data
	claims := jwt.MapClaims{
		"user_id":    user.ID.Hex(), // User ID (in case you want to identify the user by ID)
		"username":   user.Username, // User's username
		"First Name": user.FirstName,
		"Last Name":  user.LastName,
		"role":       user.Role,                                 // User's email
		"exp":        time.Now().Add(time.Hour * 24 * 7).Unix(), // Token expiration time (7 day)
	}

	logger.LogInfo("generateRefreshTokenJWT :: claim map formed ")

	// Create a new token with claims and sign it with the secret key
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secretKey := []byte(os.Getenv("JWT_SECRET_KEY"))
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		logger.LogError("generateRefreshTokenJWT :: error in  Create a new token with claims and sign it with the secret key" + err.Error())
		return "", err
	}

	return tokenString, nil
}

// FetchUserByUsername fetches a user from the database using their username.
func FetchUserByUsername(username string) (*models.User, error) {
	logger.LogInfo("FetchUserByUsername :: starting")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"username": username}

	var user models.User
	err := database.GetCollection(os.Getenv("MONGO_TABLE_USER")).FindOne(ctx, filter).Decode(&user)
	if err != nil {
		logger.LogError("User not found " + err.Error())
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	logger.LogInfo("FetchUserByUsername :: ending ")
	return &user, nil
}

func CompareHashAndPassword(fetchedUserPassword string, loginUserPassword string) error {
	// Compare the stored hash with the provided password
	err := bcrypt.CompareHashAndPassword([]byte(fetchedUserPassword), []byte(loginUserPassword))
	if err != nil {
		return errors.New("invalid credentials") // Password does not match
	}
	return nil
}

func InsertJwtTokenForUser(token string, refreshToken string, user *models.User) (string, string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"username": user.Username}

	loginResp := &models.LoginResponse{
		Username:     user.Username,
		RefreshToken: refreshToken,
		Token:        token,
	}
	update := bson.M{
		"$set": loginResp, // Replace the document with the new data
	}
	opts := options.Update().SetUpsert(true)
	_, err := jwtCollection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		logger.LogError("InsertJwtTokenForUser :: Unable to store JWT token in DB " + err.Error())
		return "", "", err
	}
	return token, refreshToken, nil
}

func FetchJwtTokenForUser(username string) (*models.LoginResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Define the filter to find the user's token
	filter := bson.M{"username": username}

	// Define a variable to hold the result
	var loginResp models.LoginResponse

	// Perform the query to find the document
	err := jwtCollection.FindOne(ctx, filter).Decode(&loginResp)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			logger.LogError("FetchJwtTokenForUser :: No JWT token found for user: " + username)
			return nil, errors.New("no JWT token found for the user")
		}
		logger.LogError("FetchJwtTokenForUser :: Error fetching JWT token: " + err.Error())
		return nil, err
	}

	logger.LogInfo("FetchJwtTokenForUser :: Successfully fetched JWT token for user: " + username)
	return &loginResp, nil
}

func LogoutUser(username string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Define the filter to identify the user's token
	filter := bson.M{"username": username}

	// Attempt to delete the user's token document from the collection
	result, err := jwtCollection.DeleteOne(ctx, filter)
	if err != nil {
		logger.LogError("Logout :: Error while removing JWT token from DB for user: " + username + " - " + err.Error())
		return errors.New("failed to logout the user")
	}

	// Check if any document was deleted
	if result.DeletedCount == 0 {
		logger.LogError("Logout :: No JWT token found to remove for user: " + username)
		return errors.New("no active session found for the user")
	}

	logger.LogInfo("Logout :: Successfully logged out user: " + username)
	return nil
}

func UserFetchFromDB(username string) (*models.UserResponse, error) {
	logger.LogInfo("UserFetchFromDB :: started")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.UserResponse
	filter := bson.M{"username": username}

	err := userCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			logger.LogError("User not found " + err.Error())
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	logger.LogInfo("UserFetchFromDB :: ended")
	return &user, nil
}
