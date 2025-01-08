package repo

import (
	"context"
	"errors"
	"mime/multipart"
	"time"

	"github.com/cloudinary/cloudinary-go/api/uploader"
	"github.com/utkarshpr/ecommerce/config"
	"github.com/utkarshpr/ecommerce/logger"
	"github.com/utkarshpr/ecommerce/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddProduct(product *models.AddProduct, files []*multipart.FileHeader) error {
	logger.LogInfo("AddProduct Repo :: starting")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"$or": []bson.M{
			{"id": product.ID},
		},
	}

	count, err := productCollection.CountDocuments(ctx, filter)
	if err != nil {
		logger.LogError("error in inserting product " + err.Error())
		return err
	}
	if count > 0 {
		return errors.New("id already exists")
	}

	var mediaURLs []string

	// Loop through each file and upload
	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			logger.LogError("Failed to open file: " + err.Error())
			return errors.New("unable to open media file")
		}
		defer file.Close()

		// Upload to Cloudinary
		logger.LogInfo("Uploading media to Cloudinary...")
		mediaURL, err := UploadMedia(file, fileHeader)
		if err != nil {
			logger.LogError("Failed to upload media to Cloudinary: " + err.Error())
			return errors.New("unable to upload media")
		}

		logger.LogInfo("Media uploaded successfully: " + mediaURL)
		mediaURLs = append(mediaURLs, mediaURL)
	}
	logger.LogInfo(mediaURLs)
	product.MediaURL = mediaURLs

	_, err = productCollection.InsertOne(ctx, product)
	if err != nil {
		logger.LogError("error in inserting user " + err.Error())
		return err
	}

	logger.LogInfo("AddProduct Repo :: ending")
	return nil
}
func UploadMedia(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	// Initialize Cloudinary
	cld, err := config.InitCloudinary()
	if err != nil {
		return "", err
	}

	ctx := context.Background()

	// Upload the file
	uploadResult, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: "ecommerce_media", // Folder in your Cloudinary account
	})
	if err != nil {
		return "", err
	}

	// Return the secure URL of the uploaded media
	return uploadResult.SecureURL, nil
}

func GetAllProduct() ([]models.AddProduct, error) {
	logger.LogInfo("GetAllProduct Repo :: started")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var products []models.AddProduct

	// Find all documents in the collection
	cursor, err := productCollection.Find(ctx, bson.M{})
	if err != nil {
		logger.LogError("GetAllProduct Repo :: Error while fetching products :: " + err.Error())
		return nil, err
	}
	defer cursor.Close(ctx)

	// Iterate over the cursor and decode each product into the products slice
	for cursor.Next(ctx) {
		var product models.AddProduct
		if err := cursor.Decode(&product); err != nil {
			logger.LogError("GetAllProduct Repo :: Error while decoding product :: " + err.Error())
			return nil, err
		}
		products = append(products, product)
	}

	// Check if there was an error in cursor iteration
	if err := cursor.Err(); err != nil {
		logger.LogError("GetAllProduct Repo :: Cursor error :: " + err.Error())
		return nil, err
	}

	logger.LogInfo("GetAllProduct Repo :: end")
	return products, nil
}

func GetSpecificProduct(id string) (*models.AddProduct, error) {
	logger.LogInfo("GetSpecificProduct Repo :: started")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var product models.AddProduct

	// Find the document with the matching ID
	err := productCollection.FindOne(ctx, bson.M{"id": id}).Decode(&product)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			logger.LogInfo("No product found with the provided ID")
			return nil, nil // No product found
		}
		logger.LogError("GetSpecificProduct Repo :: Error while fetching product :: " + err.Error())
		return nil, err // Error while fetching product
	}

	logger.LogInfo("GetSpecificProduct Repo :: end")
	return &product, nil
}
