package stat

import (
	"testing"
	"net/http"
	"net/url"
)

func TestUserAgentIsPulledFromTheReques (t *testing.T) {
	request := buildRequest(t)
	stat := FromRequest(request)
	
	expectedUserAgent := "Dummy;user;agent"

	if (stat.UserAgent != expectedUserAgent) {
		t.Fatalf("Expected %s but found %s", expectedUserAgent, stat.UserAgent)
	}
}

func TestNameComesFromTheQueryStringName (t *testing.T) {
	request := buildRequest(t)
	stat := FromRequest(request)

	expectedStatName := "onload";

	if (stat.Name != expectedStatName) {
		t.Fatalf("Expected %s but found %s", expectedStatName, stat.Name)
	}
}

func TestValueComesFromTheQueryStringValue (t *testing.T) {
	request := buildRequest(t)
	stat := FromRequest(request)

	expectedStatValue := 200

	if (stat.Value != expectedStatValue) {
		t.Fatalf("Expected %d but found %d", expectedStatValue, stat.Value)
	}
}

func TestStringReturnsTheExpectedResult (t *testing.T) {
	request := buildRequest(t)
	stat :=  FromRequest(request)

	expectedString := "Name: onload | Value: 200 | User Agent: Dummy;user;agent"
	result := stat.String()
	if (stat.String() != expectedString) {
		t.Fatalf("Expected %s but found %s", expectedString, result)
	}
}

func buildRequest(t *testing.T) (*http.Request) {
	request := new (http.Request)
	header := http.Header{}
	header.Add("User-Agent", "Dummy;user;agent")
	request.Header = header
	url, err := url.Parse("http://test.com?onload=200")
	if (err != nil) {
		t.Fatal(err);
	}
	request.URL = url
	return request
}