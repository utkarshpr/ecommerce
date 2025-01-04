package logger

import (
	"log"
	"os"
	"sync"
)

// Logger is the global logger object
var (
	Logger *log.Logger
	once   sync.Once
)

// InitLogger initializes the logger with a file output
func InitLogger(logFile string) {
	once.Do(func() {
		// Open the log file, create it if it doesn't exist, append to it if it does
		file, err := os.OpenFile(logFile, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
		if err != nil {
			log.Fatalf("Error opening log file: %v", err)
		}

		// Initialize the logger to write to the file with timestamp prefix
		Logger = log.New(file, "", log.LstdFlags|log.Lshortfile)
		// Log that the logger has been initialized
		Logger.Println("Logger initialized.")
	})
}

// LogInfo logs an info-level message
func LogInfo(message string) {
	if Logger != nil {
		Logger.Println("INFO:", message)
	} else {
		log.Println("Logger not initialized!")
	}
}

// LogWarn logs a warning-level message
func LogWarn(message string) {
	if Logger != nil {
		Logger.Println("WARN:", message)
	} else {
		log.Println("Logger not initialized!")
	}
}

// LogError logs an error-level message
func LogError(message string) {
	if Logger != nil {
		Logger.Println("ERROR:", message)
	} else {
		log.Println("Logger not initialized!")
	}
}

// LogFatal logs a fatal-level message and exits the program
func LogFatal(message string) {
	if Logger != nil {
		Logger.Println("FATAL:", message)
		os.Exit(1)
	} else {
		log.Println("Logger not initialized!")
		os.Exit(1)
	}
}

// CloseLogger closes the log file if applicable
func CloseLogger() {
	if Logger != nil {
		if file, ok := Logger.Writer().(*os.File); ok {
			Logger.Println("Closing logger.")
			file.Close()
		}
	}
}
