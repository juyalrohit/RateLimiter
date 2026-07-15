# Redis Distributed Rate Limiter

A production-style distributed rate limiter built from scratch using **Node.js**, **Express**, **Redis**, and **Lua Scripts**. This project explores multiple rate limiting algorithms, compares their trade-offs, and demonstrates how production systems handle request throttling.

---

## Overview

Rate limiting protects backend services from abuse, brute-force attacks, traffic spikes, and resource exhaustion by restricting how many requests a client can make within a specified time window.

Instead of using existing libraries, this project implements the core algorithms from scratch to understand their design, trade-offs, and production considerations.

---

## Tech Stack

* Node.js
* Express.js
* Redis
* Lua Scripts
* JavaScript (ES Modules)
* k6 (Load Testing)

---

## Features

### 1. Fixed Window Rate Limiter

* In-memory implementation
* Redis implementation
* Configurable request limit and window duration
* HTTP 429 responses
* Rate limit headers

### 2. Sliding Window Rate Limiter

* Redis Sorted Set (ZSET)
* Timestamp-based request tracking
* Automatic cleanup of expired requests
* Prevents burst traffic at window boundaries

### 3. Token Bucket Rate Limiter

* Lazy token refill
* Configurable bucket size
* Configurable refill interval
* Supports controlled traffic bursts
* Efficient Redis Hash storage

### Lua Script Optimization

* Atomic execution of Redis commands
* Eliminates race conditions
* Reduces Redis network round trips
* Production-oriented implementation

### Load Testing

* Tested using k6
* Measured latency
* Verified concurrent request handling
* Compared algorithm behavior under load

---

## Why Redis Instead of Memory?

An in-memory solution works only for a single server.

Problems with memory storage:

* Data is lost when the server restarts.
* Multiple application instances maintain different counters.
* Does not work correctly behind a load balancer.

Redis solves these problems by providing:

* Shared distributed state
* High performance
* Built-in expiration (TTL)
* Atomic operations
* Rich data structures

---

## Algorithms Implemented

### Fixed Window

Stores a counter for each client and resets it after a fixed time window.

**Advantages**

* Simple
* Fast
* Low memory usage

**Limitations**

* Allows burst traffic at window boundaries.

---

### Sliding Window

Stores timestamps of every request using Redis Sorted Sets.

For every request:

1. Remove expired timestamps.
2. Count active requests.
3. Reject if limit exceeded.
4. Otherwise insert the current request.

**Advantages**

* More accurate
* Eliminates boundary burst issue

**Trade-offs**

* Higher memory usage
* More Redis operations

---

### Token Bucket

Stores:

* Available tokens
* Last refill timestamp

Tokens are replenished lazily only when a new request arrives.

**Advantages**

* Supports controlled bursts
* Fair request distribution
* Efficient memory usage

---

## Project Structure

```text
src/
├── middleware/
│   └── rateLimiter.middleware.js
├── rateLimiter/
│   ├── FixedWindowRateLimiter.js
│   ├── FixedWindowRedisRateLimiter.js
│   ├── SlidingWindowRateLimiter.js
│   ├── TokenBucketRateLimiter.js
│   ├── MemoryStorage.js
│   └── Lua Scripts
├── routes/
└── config/
    └── redis.js
```

---

## Key Concepts Demonstrated

* Distributed Systems
* Redis
* Lua Scripting
* Atomic Operations
* Middleware Design
* Object-Oriented Programming
* Dependency Injection
* Load Testing
* Performance Optimization
* Race Condition Handling
* Backend System Design

---

## Future Improvements

* Leaky Bucket implementation
* Adaptive rate limiting
* Hierarchical rate limiting
* Distributed worker support
* Metrics and monitoring
* Docker Compose setup
* npm package support
* Unit and integration tests

---

## Lessons Learned

This project demonstrates that selecting the right data structure is often more important than writing complex code.

* Fixed Window naturally maps to counters.
* Sliding Window naturally maps to Sorted Sets.
* Token Bucket naturally maps to token state and refill timestamps.
* Lua Scripts provide atomic execution for multi-step Redis operations.

The project also highlights the trade-offs between fairness, memory consumption, implementation complexity, and performance across different rate limiting algorithms.
