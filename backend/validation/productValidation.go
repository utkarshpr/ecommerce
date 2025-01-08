package validation

import (
	"errors"
	"strings"
	"time"

	"github.com/utkarshpr/ecommerce/models"
)

func ValidationAddProduct(p *models.AddProduct) error {
	// Check required fields
	if strings.TrimSpace(p.Name) == "" {
		return errors.New("product name is required")
	}
	if strings.TrimSpace(p.Category) == "" {
		return errors.New("product category is required")
	}
	if p.Price <= 0 {
		return errors.New("product price must be greater than zero")
	}
	if p.Quantity < 0 {
		return errors.New("product quantity cannot be negative")
	}
	if p.ManufactureDate != "" {
		if _, err := time.Parse("2006-01-02", p.ManufactureDate); err != nil {
			return errors.New("invalid manufacture date format, expected YYYY-MM-DD")
		}
	}
	if p.ExpiryDate != "" {
		if _, err := time.Parse("2006-01-02", p.ExpiryDate); err != nil {
			return errors.New("invalid expiry date format, expected YYYY-MM-DD")
		}
	}
	// if p.ImageURL != "" && !strings.HasPrefix(p.ImageURL, "http") {
	// 	return errors.New("invalid image URL")
	// }

	if len(p.Tags) == 0 {
		return errors.New("invalid tag it cannot be empty")
	}

	return nil
}
