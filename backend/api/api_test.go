package api

import (
	"context"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/MaT1g3R/slaytherelics/o11y"
	"gotest.tools/v3/assert"
)

func TestAPIHandler(t *testing.T) {
	ctx := context.Background()
	cancel := o11y.Init("test")
	defer cancel(ctx)

	// TODO: stubs for each service
	apiHandler, err := New(nil, nil, nil)
	assert.NilError(t, err)

	handlerFunc := apiHandler.Router.Handler()

	t.Run("getDeckHandler", func(t *testing.T) {
		type testCase struct {
			name           string
			deckRawContent string
			expectedStatus int
			expectedOutput string
		}

		tcs := []testCase{
			{
				name:           "Empty",
				expectedStatus: 500, // error parsing deck
			},
			{
				name:           "Invalid card index",
				deckRawContent: "card|junk||};;;&01;&1;x;;&02;&1;y;;&03;&1;z",
				expectedStatus: 500,
			},
			{
				name:           "Negative card index",
				deckRawContent: "card|junk||-1;;;&01;&1;x;;&02;&1;y;;&03;&1;z",
				expectedStatus: 500,
			},
			{
				name:           "Out of bounds card index",
				deckRawContent: "card|junk||3;;;&01;&1;x;;&02;&1;y;;&03;&1;z",
				expectedStatus: 500,
			},
			{
				name:           "Simple deck",
				deckRawContent: "card|junk||0,1,1,0,2,0;;;&01;&1;x;;&02;&1;y;;&03;&1;z",
				expectedOutput: "card1 x3\ncard2 x2\ncard3 x1\n",
				expectedStatus: 200,
			},
		}

		for i, tc := range tcs {
			t.Run(tc.name, func(t *testing.T) {
				deckName := "deck" + string(strconv.AppendInt(nil, int64(i), 10))
				// use lock if adding t.Parallel
				apiHandler.deckLists[deckName] = tc.deckRawContent

				req := httptest.NewRequest("GET", "/deck/"+deckName, nil)
				w := httptest.NewRecorder()
				handlerFunc.ServeHTTP(w, req)

				assert.Equal(t, w.Code, tc.expectedStatus)

				if tc.expectedOutput != "" {
					assert.Equal(t, w.Body.String(), tc.expectedOutput, w.Body.String(), tc.expectedOutput)
				}
			})
		}

		t.Run("not found", func(t *testing.T) {
			req := httptest.NewRequest("GET", "/deck/something_not_made", nil)
			w := httptest.NewRecorder()
			handlerFunc.ServeHTTP(w, req)

			assert.Equal(t, w.Code, 404)
		})
	})
}
