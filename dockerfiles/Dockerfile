FROM arangodb/arangodb

COPY ./arangod.conf /etc/arangodb3/arangod.conf

RUN mkdir -p /var/lib/arangodb3-rocksdb
RUN chown -R arangodb /var/lib/arangodb3-rocksdb
