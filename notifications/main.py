import asyncio
from asyncio.log import logger
from datetime import datetime, timezone

from app import proccessers
from app.database import Tasks


async def main():
    while True:
        pending = list(Tasks.find({"execute_at": {"$lte": datetime.now(tz=timezone.utc)}}))
        for task in pending:
            task_type = task.get("type")
            kwargs = task.get("body", {})
            proccesser = getattr(proccessers, "proccess_" + task_type)
            if not proccesser or not asyncio.iscoroutinefunction(proccesser):
                continue
            try:
                asyncio.create_task(proccesser(**kwargs))
            except Exception as e:
                logger.error(f"Task of type {task_type} with kwargs {kwargs} raised exception: {e}")
        asyncio.sleep(60)


if __name__ == "__main__":
    asyncio.run(main)
