-- Ensure newer schema fields exist on legacy databases
ALTER TABLE "ServiceRequest"
ADD COLUMN IF NOT EXISTS "priority" TEXT NOT NULL DEFAULT 'MEDIUM';

ALTER TABLE "ServiceRequest"
ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);

ALTER TABLE "Feedback"
ADD COLUMN IF NOT EXISTS "sentiment" TEXT NOT NULL DEFAULT 'NEUTRAL';

-- Booking table
CREATE TABLE IF NOT EXISTS "Booking" (
  "id" TEXT NOT NULL,
  "guestId" TEXT NOT NULL,
  "roomType" TEXT NOT NULL,
  "checkIn" TIMESTAMP(3) NOT NULL,
  "checkOut" TIMESTAMP(3) NOT NULL,
  "guests" INTEGER NOT NULL,
  "totalPrice" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
  "specialRequests" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- Payment table
CREATE TABLE IF NOT EXISTS "Payment" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT,
  "userId" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "method" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "stripeId" TEXT,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- Notification table
CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- Analytics table
CREATE TABLE IF NOT EXISTS "Analytics" (
  "id" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "totalRequests" INTEGER NOT NULL DEFAULT 0,
  "completedRequests" INTEGER NOT NULL DEFAULT 0,
  "totalBookings" INTEGER NOT NULL DEFAULT 0,
  "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "ServiceRequest_guestId_idx" ON "ServiceRequest"("guestId");
CREATE INDEX IF NOT EXISTS "ServiceRequest_status_idx" ON "ServiceRequest"("status");
CREATE INDEX IF NOT EXISTS "Feedback_guestId_idx" ON "Feedback"("guestId");
CREATE INDEX IF NOT EXISTS "Feedback_sentiment_idx" ON "Feedback"("sentiment");
CREATE INDEX IF NOT EXISTS "Booking_guestId_idx" ON "Booking"("guestId");
CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking"("status");
CREATE INDEX IF NOT EXISTS "Booking_checkIn_idx" ON "Booking"("checkIn");
CREATE INDEX IF NOT EXISTS "Payment_userId_idx" ON "Payment"("userId");
CREATE INDEX IF NOT EXISTS "Payment_bookingId_idx" ON "Payment"("bookingId");
CREATE INDEX IF NOT EXISTS "Payment_status_idx" ON "Payment"("status");
CREATE INDEX IF NOT EXISTS "Analytics_date_idx" ON "Analytics"("date");

-- Foreign keys (idempotent do-block)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Booking_guestId_fkey'
  ) THEN
    ALTER TABLE "Booking"
      ADD CONSTRAINT "Booking_guestId_fkey"
      FOREIGN KEY ("guestId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Payment_bookingId_fkey'
  ) THEN
    ALTER TABLE "Payment"
      ADD CONSTRAINT "Payment_bookingId_fkey"
      FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Payment_userId_fkey'
  ) THEN
    ALTER TABLE "Payment"
      ADD CONSTRAINT "Payment_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
