package api

import (
	"hub.fastgit.org/pkg/errors"

	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/api/as"
	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/api/external"
	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/api/js"
	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/config"
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
