package controllers

import (
	"encoding/json"
	"net/http"

	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/utkarshpr/ecommerce/logger"
	"github.com/utkarshpr/ecommerce/models"
	"github.com/utkarshpr/ecommerce/services"
	"github.com/utkarshpr/ecommerce/validation"
)

// SignUpController handles user sign-up requests.
//
// @Summary Sign up a new user
// @Description Processes user registration by validating the input and creating a new user.
// @Tags Authentication
// @Accept json
// @Produce json
// @Param user body models.User true "User Details"
// @Success 201 {object} models.GenericResponse
// @Failure 400 {object} models.GenericResponse
// @Failure 405 {object} models.GenericResponse
// @Failure 500 {object} models.GenericResponse
// @Router /auth/signup [post]
func SignUpController(w http.ResponseWriter, r *http.Request) {

	logger.LogInfo("SignUpController :: started")
	// Only allow POST method
	if r.Method != "POST" {
		logger.LogError("SignUpController :: error POST method required")
		models.ManageResponse(w, "POST method required", http.StatusMethodNotAllowed, nil, false)
		return
	}

	var user models.User

	// Decode the JSON body into the User struct
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&user)
	if err != nil {
		if strings.HasPrefix(err.Error(), "invalid role:") {
			logger.LogError("SignUpController ::Invalid role provided. Allowed roles are 'ADMIN' or 'CLIENT")
			models.ManageResponse(w, "Error : "+"Invalid role provided. Allowed roles are 'ADMIN' or 'CLIENT'.", http.StatusBadRequest, nil, false)
			return
		}
		logger.LogError("SignUpController :: error in decoding the body" + err.Error())
		models.ManageResponse(w, "error in decoding the body "+err.Error(), http.StatusBadRequest, nil, false)

		return
	}
	logger.LogInfo(user)
	// validation
	err = validation.SignUpUserValidation(&user)
	if err != nil {
		logger.LogError("SignUpController :: error in validation  " + err.Error())
		models.ManageResponse(w, "Error : "+err.Error(), http.StatusBadRequest, nil, false)
		return
	}

	// Call the service to handle sign-up logic
	err = services.CreateUser(&user)
	if err != nil {
		logger.LogError("SignUpController :: error in service call " + err.Error())
		models.ManageResponse(w, "Unable to create the User "+err.Error(), http.StatusBadRequest, nil, false)
		return
	}

	// // Return success response
	responseModel := &models.UserResponse{
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Address:   user.Address,
	}
	logger.LogInfo("SignUpController :: ended")
	models.ManageResponse(w, "User created successfully.", http.StatusAccepted, responseModel, true)
}

// LoginController handles user login requests.
//
// @Summary User login
// @Description Authenticates the user with valid credentials and returns a JWT token.
// @Tags Authentication
// @Accept json
// @Produce json
// @Param user body models.LoginUser true "Login User Details"
// @Success 200 {object} models.GenericResponse
// @Failure 400 {object} models.GenericResponse
// @Failure 405 {object} models.GenericResponse
// @Failure 500 {object} models.GenericResponse
// @Router /auth/login [post]
func LoginController(w http.ResponseWriter, r *http.Request) {

	logger.LogInfo("LoginController :: started")
	if r.Method != "POST" {
		logger.LogError("LoginController :: error POST method required")
		models.ManageResponse(w, "POST method required", http.StatusMethodNotAllowed, nil, false)
		return
	}

	var user models.LoginUser

	// Decode the JSON body into the User struct
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&user)
	if err != nil {
		logger.LogError("LoginController :: error in decoding the body")
		models.ManageResponse(w, "error in decoding the body", http.StatusBadRequest, nil, false)

		return
	}

	logger.LogInfo(user)
	// validation
	err = validation.LoginUserValidation(&user)
	if err != nil {
		logger.LogError("LoginController :: error in validation  " + err.Error())
		models.ManageResponse(w, "Error : "+err.Error(), http.StatusBadRequest, nil, false)
		return
	}

	//password match
	token, refreshtoken, err := services.LoginUser(&user)
	if err != nil {
		logger.LogError("LoginController :: error in service call " + err.Error())
		models.ManageResponse(w, "Unable to login the User "+err.Error(), http.StatusBadRequest, nil, false)
		return
	}

	resp := &models.LoginResponse{
		Username:     user.Username,
		Token:        token,
		RefreshToken: refreshtoken,
	}

	logger.LogInfo("LoginController :: ended")
	models.ManageResponse(w, "User LoggedIn successfully.", http.StatusOK, resp, true)

}

// LogoutController handles user logout by removing their JWT tokens from the database.
//
// @Summary Logs out the user by invalidating their JWT token.
// @Description This endpoint logs out the currently logged-in user. The user must be authenticated,
// and their JWT token will be removed from the database. A valid "Authorization" header with a bearer token is required.
// @Tags Authentication
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Success 202 {object} models.GenericResponse
// @Failure 405 {object} models.GenericResponse
// @Failure 401 {object} models.GenericResponse
// @Failure 500 {object} models.GenericResponse
// @Failure 400 {object} models.GenericResponse
// @Router /auth/logout [post]
func LogoutController(c *gin.Context) {

	logger.LogInfo("LogoutController :: started")
	if c.Request.Method != "POST" {
		logger.LogError("LogoutController :: error POST method required")
		models.ManageResponse(c.Writer, "POST method required", http.StatusMethodNotAllowed, nil, false)
		return
	}

	userClaims, exists := c.Get("user")
	if !exists {
		logger.LogInfo("LogoutController :: unauthorized..")
		models.ManageResponse(c.Writer, "Unauthorized", http.StatusUnauthorized, nil, false)
		return
	}

	claims, ok := userClaims.(jwt.MapClaims)
	if !ok {
		logger.LogInfo("LogoutController :: unable to process claim")
		models.ManageResponse(c.Writer, "Unable to process claim", http.StatusUnauthorized, nil, false)
		return
	}
	username := claims["username"].(string)

	err := services.LogoutUser(username)
	if err != nil {
		logger.LogInfo("LogoutController :: unable to log out " + err.Error())
		models.ManageResponse(c.Writer, "Unableto Logout", http.StatusBadRequest, nil, false)
		return
	}
	logger.LogInfo("LogoutController :: ended")
	models.ManageResponse(c.Writer, "Logout successfuly ", http.StatusAccepted, nil, true)

}
