import asyncio
from asyncio.log import logger
from datetime import datetime, timezone

from app import proccessers
from app.database import Tasks


async def main():
    while True:
        pending = list(Tasks.find({"execute_at": {"$lte": datetime.now(tz=timezone.utc)}, "status": "pending"}))
        for task in pending:
            task_type = task.get("type")
            kwargs = task.get("body", {})
            proccesser = getattr(proccessers, "proccess_" + task_type)
            if not proccesser or not asyncio.iscoroutinefunction(proccesser):
                continue
            try:
                asyncio.create_task(proccesser(**kwargs))
                Tasks.update_one({"_id": pending["_id"]}, {"$set": {"status": "success"}})
            except Exception as e:
                logger.error(f"Task of type {task_type} with kwargs {kwargs} raised exception: {e}")
                Tasks.update_one({"_id": pending["_id"]}, {"$set": {"status": "fail"}})
        asyncio.sleep(60)


if __name__ == "__main__":
    asyncio.run(main)
