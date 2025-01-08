package models

type AddProduct struct {
	ID              string   `json:"id" form:"id" binding:"required"`
	Name            string   `json:"name" form:"name" binding:"required"`
	Description     string   `json:"description" form:"description"`
	Category        string   `json:"category" form:"category"`
	Price           float64  `json:"price" form:"price" binding:"required"`
	Quantity        int      `json:"quantity" form:"quantity"`
	SKU             string   `json:"sku" form:"sku"`
	Barcode         string   `json:"barcode" form:"barcode"`
	Supplier        string   `json:"supplier" form:"supplier"`
	ManufactureDate string   `json:"manufacture_date" form:"manufacture_date"`
	ExpiryDate      string   `json:"expiry_date" form:"expiry_date"`
	Weight          float64  `json:"weight" form:"weight"`
	Dimensions      string   `json:"dimensions" form:"dimensions"`
	Tags            []string `json:"tags" form:"tags[]"` // Array of tags
	IsActive        bool     `json:"is_active" form:"is_active"`
	CreatedAt       string   `json:"created_at" form:"created_at"`
	UpdatedAt       string   `json:"updated_at" form:"updated_at"`
	MediaURL        []string `form:"media_url,omitempty" bson:"media_url,omitempty"`
}
