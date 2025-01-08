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
