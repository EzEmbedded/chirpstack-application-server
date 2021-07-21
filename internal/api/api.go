package api

import (
	"github.com.cnpmjs.org/pkg/errors"

	"github.com.cnpmjs.org/brocaar/chirpstack-application-server/internal/api/as"
	"github.com.cnpmjs.org/brocaar/chirpstack-application-server/internal/api/external"
	"github.com.cnpmjs.org/brocaar/chirpstack-application-server/internal/api/js"
	"github.com.cnpmjs.org/brocaar/chirpstack-application-server/internal/config"
)

// Setup configures the API endpoints.
func Setup(conf config.Config) error {
	if err := as.Setup(conf); err != nil {
		return errors.Wrap(err, "setup application-server api error")
	}

	if err := external.Setup(conf); err != nil {
		return errors.Wrap(err, "setup external api error")
	}

	if err := js.Setup(conf); err != nil {
		return errors.Wrap(err, "setup join-server api error")
	}

	return nil
}
