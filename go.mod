module hub.fastgit.org/brocaar/chirpstack-application-server

go 1.16

require (
	hub.fastgit.org/NickBall/go-aes-key-wrap v0.0.0-20170929221519-1c3aa3e4dfc5
	hub.fastgit.org/aws/aws-sdk-go v1.26.3
	hub.fastgit.org/brocaar/chirpstack-api/go/v3 v3.10.0
	hub.fastgit.org/brocaar/lorawan v0.0.0-20210629093152-95aaed5ba796
	hub.fastgit.org/coreos/go-oidc v2.2.1+incompatible
	hub.fastgit.org/dgrijalva/jwt-go v3.2.0+incompatible
	hub.fastgit.org/eclipse/paho.mqtt.golang v1.3.1
	hub.fastgit.org/go-redis/redis/v8 v8.8.3
	hub.fastgit.org/gofrs/uuid v3.2.0+incompatible
	hub.fastgit.org/gogo/protobuf v1.3.2 // indirect
	hub.fastgit.org/golang-migrate/migrate/v4 v4.14.1
	hub.fastgit.org/golang/protobuf v1.4.3
	hub.fastgit.org/gopherjs/gopherjs v0.0.0-20190430165422-3e4dfb77656c // indirect
	hub.fastgit.org/goreleaser/goreleaser v0.106.0
	hub.fastgit.org/goreleaser/nfpm v0.11.0
	hub.fastgit.org/gorilla/mux v1.7.4
	hub.fastgit.org/grpc-ecosystem/go-grpc-middleware v1.1.0
	hub.fastgit.org/grpc-ecosystem/go-grpc-prometheus v1.2.0
	hub.fastgit.org/grpc-ecosystem/grpc-gateway v1.12.1
	hub.fastgit.org/jmoiron/sqlx v1.2.0
	hub.fastgit.org/lib/pq v1.8.0
	hub.fastgit.org/mmcloughlin/geohash v0.9.0
	hub.fastgit.org/pelletier/go-toml v1.6.0 // indirect
	hub.fastgit.org/pkg/errors v0.9.1
	hub.fastgit.org/pquerna/cachecontrol v0.0.0-20180517163645-1555304b9b35 // indirect
	hub.fastgit.org/prometheus/client_golang v1.2.1
	hub.fastgit.org/prometheus/client_model v0.0.0-20191202183732-d1d2010b5bee // indirect
	hub.fastgit.org/prometheus/procfs v0.0.8 // indirect
	hub.fastgit.org/robertkrimen/otto v0.0.0-20191217063420-37f8e9a2460c
	hub.fastgit.org/segmentio/kafka-go v0.4.17
	hub.fastgit.org/sirupsen/logrus v1.7.0
	hub.fastgit.org/smartystreets/assertions v1.0.0 // indirect
	hub.fastgit.org/smartystreets/goconvey v1.6.4
	hub.fastgit.org/spf13/afero v1.2.2 // indirect
	hub.fastgit.org/spf13/cobra v0.0.5
	hub.fastgit.org/spf13/jwalterweatherman v1.1.0 // indirect
	hub.fastgit.org/spf13/pflag v1.0.5 // indirect
	hub.fastgit.org/spf13/viper v1.6.2
	hub.fastgit.org/streadway/amqp v0.0.0-20190827072141-edfb9018d271
	hub.fastgit.org/stretchr/testify v1.7.0
	hub.fastgit.org/tmc/grpc-websocket-proxy v0.0.0-20201229170055-e5319fda7802
	golang.org/x/crypto v0.0.0-20200709230013-948cd5f35899
	golang.org/x/lint v0.0.0-20200302205851-738671d3881b
	golang.org/x/net v0.0.0-20201224014010-6772e930b67b
	golang.org/x/oauth2 v0.0.0-20200107190931-bf48bf16ab8d
	golang.org/x/tools v0.0.0-20210106214847-113979e3529a
	google.golang.org/grpc v1.33.1
	gopkg.in/sourcemap.v1 v1.0.5 // indirect
	gopkg.in/square/go-jose.v2 v2.5.1 // indirect
)

// replace hub.fastgit.org/brocaar/chirpstack-api/go/v3 => ../chirpstack-api/go
