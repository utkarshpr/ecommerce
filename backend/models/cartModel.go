package models

type AddToCart struct {
	ForUser string  `json:"for_user" bson:"for_user"`
	Orders  []Order `json:"orders" bson:"orders"`     // List of orders in the cart
	AddedAt string  `json:"added_at" bson:"added_at"` // Timestamp when the cart was created or last updated

}

type Order struct {
	ProductID             string          `json:"product_id" bson:"product_id"`                                               // Unique identifier for the product
	Quantity              string          `json:"quantity" bson:"quantity"`                                                   // Quantity of the product
	IsSpecialRequest      bool            `json:"is_special_request" bson:"is_special_request"`                               // Flag to indicate if there's a special request
	SpecialRequestDetails *SpecialRequest `json:"special_request_details,omitempty" bson:"special_request_details,omitempty"` // Details of the special request
}

type SpecialRequest struct {
	RequestType string `json:"request_type" bson:"request_type"` // Type of special request (e.g., "gift wrap", "custom message")
	Description string `json:"description" bson:"description"`   // Detailed description of the special request
}
