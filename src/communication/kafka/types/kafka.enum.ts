export enum KafkaCompressionType {
  NONE = 'none',
  GZIP = 'gzip',
  SNAPPY = 'snappy',
  LZ4 = 'lz4',
  ZSTD = 'zstd',
}

export enum KafkaAutoOffsetReset {
  EARLIEST = 'earliest',
  LATEST = 'latest',
}
