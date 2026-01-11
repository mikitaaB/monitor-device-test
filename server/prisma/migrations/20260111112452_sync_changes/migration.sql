-- CreateTable
CREATE TABLE "Measurement" (
    "id" SERIAL NOT NULL,
    "sensorId" INTEGER NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Measurement_sensorId_idx" ON "Measurement"("sensorId");

-- CreateIndex
CREATE INDEX "Measurement_ts_idx" ON "Measurement"("ts");

-- CreateIndex
CREATE INDEX "Measurement_sensorId_ts_idx" ON "Measurement"("sensorId", "ts");
