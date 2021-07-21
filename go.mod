module github.com.cnpmjs.org/brocaar/chirpstack-application-server

go 1.16

require (
	github.com.cnpmjs.org/NickBall/go-aes-key-wrap v0.0.0-20170929221519-1c3aa3e4dfc5
	github.com.cnpmjs.org/aws/aws-sdk-go v1.26.3
	github.com.cnpmjs.org/brocaar/chirpstack-api/go/v3 v3.10.0
	github.com.cnpmjs.org/brocaar/lorawan v0.0.0-20210629093152-95aaed5ba796
	github.com.cnpmjs.org/coreos/go-oidc v2.2.1+incompatible
	github.com.cnpmjs.org/dgrijalva/jwt-go v3.2.0+incompatible
	github.com.cnpmjs.org/eclipse/paho.mqtt.golang v1.3.1
	github.com.cnpmjs.org/go-redis/redis/v8 v8.8.3
	github.com.cnpmjs.org/gofrs/uuid v3.2.0+incompatible
	github.com.cnpmjs.org/gogo/protobuf v1.3.2 // indirect
	github.com.cnpmjs.org/golang-migrate/migrate/v4 v4.14.1
	github.com.cnpmjs.org/golang/protobuf v1.4.3
	github.com.cnpmjs.org/gopherjs/gopherjs v0.0.0-20190430165422-3e4dfb77656c // indirect
	github.com.cnpmjs.org/goreleaser/goreleaser v0.106.0
	github.com.cnpmjs.org/goreleaser/nfpm v0.11.0
	github.com.cnpmjs.org/gorilla/mux v1.7.4
	github.com.cnpmjs.org/grpc-ecosystem/go-grpc-middleware v1.1.0
	github.com.cnpmjs.org/grpc-ecosystem/go-grpc-prometheus v1.2.0
	github.com.cnpmjs.org/grpc-ecosystem/grpc-gateway v1.12.1
	github.com.cnpmjs.org/jmoiron/sqlx v1.2.0
	github.com.cnpmjs.org/lib/pq v1.8.0
	github.com.cnpmjs.org/mmcloughlin/geohash v0.9.0
	github.com.cnpmjs.org/pelletier/go-toml v1.6.0 // indirect
	github.com.cnpmjs.org/pkg/errors v0.9.1
	github.com.cnpmjs.org/pquerna/cachecontrol v0.0.0-20180517163645-1555304b9b35 // indirect
	github.com.cnpmjs.org/prometheus/client_golang v1.2.1
	github.com.cnpmjs.org/prometheus/client_model v0.0.0-20191202183732-d1d2010b5bee // indirect
	github.com.cnpmjs.org/prometheus/procfs v0.0.8 // indirect
	github.com.cnpmjs.org/robertkrimen/otto v0.0.0-20191217063420-37f8e9a2460c
	github.com.cnpmjs.org/segmentio/kafka-go v0.4.17
	github.com.cnpmjs.org/sirupsen/logrus v1.7.0
	github.com.cnpmjs.org/smartystreets/assertions v1.0.0 // indirect
	github.com.cnpmjs.org/smartystreets/goconvey v1.6.4
	github.com.cnpmjs.org/spf13/afero v1.2.2 // indirect
	github.com.cnpmjs.org/spf13/cobra v0.0.5
	github.com.cnpmjs.org/spf13/jwalterweatherman v1.1.0 // indirect
	github.com.cnpmjs.org/spf13/pflag v1.0.5 // indirect
	github.com.cnpmjs.org/spf13/viper v1.6.2
	github.com.cnpmjs.org/streadway/amqp v0.0.0-20190827072141-edfb9018d271
	github.com.cnpmjs.org/stretchr/testify v1.7.0
	github.com.cnpmjs.org/tmc/grpc-websocket-proxy v0.0.0-20201229170055-e5319fda7802
	golang.org/x/crypto v0.0.0-20200709230013-948cd5f35899
	golang.org/x/lint v0.0.0-20200302205851-738671d3881b
	golang.org/x/net v0.0.0-20201224014010-6772e930b67b
	golang.org/x/oauth2 v0.0.0-20200107190931-bf48bf16ab8d
	golang.org/x/tools v0.0.0-20210106214847-113979e3529a
	google.golang.org/grpc v1.33.1
	gopkg.in/sourcemap.v1 v1.0.5 // indirect
	gopkg.in/square/go-jose.v2 v2.5.1 // indirect
)

// replace github.com.cnpmjs.org/brocaar/chirpstack-api/go/v3 => ../chirpstack-api/go
