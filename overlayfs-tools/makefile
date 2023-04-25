CC = gcc
CFLAGS = -Wall -std=c99
LDFLAGS = -lm
ifneq (,$(wildcard /etc/alpine-release))
  LDFLAGS += -lfts
endif

all: overlayfs-tools

overlayfs-tools: main.o logic.o sh.o
	$(CC) main.o logic.o sh.o -o overlayfs-tools $(LDFLAGS)

main.o: main.c logic.h
	$(CC) $(CFLAGS) -c main.c

logic.o: logic.c logic.h sh.h
	$(CC) $(CFLAGS) -c logic.c

sh.o: sh.c sh.h
	$(CC) $(CFLAGS) -c sh.c

clean:
	$(RM) main.o logic.o sh.o overlayfs-tools
