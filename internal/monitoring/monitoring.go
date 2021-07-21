package monitoring

import (
	"net/http"

	grpc_prometheus "hub.fastgit.org/grpc-ecosystem/go-grpc-prometheus"
	"hub.fastgit.org/prometheus/client_golang/prometheus/promhttp"
	log "hub.fastgit.org/sirupsen/logrus"

	"hub.fastgit.org/brocaar/chirpstack-application-server/internal/config"
)

// Setup setsup the metrics server.
func Setup(c config.Config) error {
	if c.Monitoring.Bind != "" {
		return setupNew(c)
	}
	return setupLegacy(c)
}

func setupNew(c config.Config) error {
	if c.Monitoring.Bind == "" {
		return nil
	}

	log.WithFields(log.Fields{
		"bind": c.Monitoring.Bind,
	}).Info("monitoring: setting up monitoring endpoint")

	mux := http.NewServeMux()

	if c.Monitoring.PrometheusAPITimingHistogram {
		log.Info("monitoring: enabling Prometheus api timing histogram")
		grpc_prometheus.EnableHandlingTimeHistogram()
	}

	if c.Monitoring.PrometheusEndpoint {
		log.WithFields(log.Fields{
			"endpoint": "/metrics",
		}).Info("monitoring: registering Prometheus endpoint")
		mux.Handle("/metrics", promhttp.Handler())
	}

	if c.Monitoring.HealthcheckEndpoint {
		log.WithFields(log.Fields{
			"endpoint": "/health",
		}).Info("monitoring: registering healthcheck endpoint")
		mux.HandleFunc("/health", healthCheckHandlerFunc)
	}

	server := http.Server{
		Handler: mux,
		Addr:    c.Monitoring.Bind,
	}

	go func() {
		err := server.ListenAndServe()
		log.WithError(err).Error("monitoring: monitoring server error")
	}()

	return nil
}

func setupLegacy(c config.Config) error {
	if !c.Metrics.Prometheus.EndpointEnabled {
		return nil
	}

	if c.Metrics.Prometheus.APITimingHistogram {
		grpc_prometheus.EnableHandlingTimeHistogram()
	}

	log.WithFields(log.Fields{
		"bind": c.Metrics.Prometheus.Bind,
	}).Info("metrics: starting prometheus metrics server")

	server := http.Server{
		Handler: promhttp.Handler(),
		Addr:    c.Metrics.Prometheus.Bind,
	}

	go func() {
		err := server.ListenAndServe()
		log.WithError(err).Error("metrics: prometheus metrics server error")
	}()

	return nil
}
