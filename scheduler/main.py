from app.app import run
import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%d.%m.%Y] [%H:%M:%S",
    stream=sys.stdout
)

if __name__ == "__main__":
    run()
