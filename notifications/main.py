import asyncio
from asyncio.log import logger
from datetime import datetime, timezone

from app import proccessers
from app.database import Tasks
import app.meet.meet_providers


async def main():
    Tasks.update_one(
        {
            "type": "rntgroup",
            "status": "pending"
        }, 
        {
            "$set": {
                "type": "rntgroup",
                "execute_at": datetime.now(tz=timezone.utc),
                "status": "pending"
            }
        },
        upsert=True
    )
    while True:
        pending = list(Tasks.find({"execute_at": {"$lte": datetime.now(tz=timezone.utc)}, "status": "pending"}))
        for task in pending:
            task_type = task.get("type")
            kwargs = task.get("body", {})
            proccesser = getattr(proccessers, "proccess_" + task_type)
            if not proccesser or not asyncio.iscoroutinefunction(proccesser):
                Tasks.update_one({"_id": task["_id"]}, {"$set": {"status": "fail"}})
                continue
            try:
                asyncio.create_task(proccesser(**kwargs))
                Tasks.update_one({"_id": task["_id"]}, {"$set": {"status": "success"}})
            except Exception as e:
                logger.error(f"Task of type {task_type} with kwargs {kwargs} raised exception: {e}")
                Tasks.update_one({"_id": task["_id"]}, {"$set": {"status": "fail"}})
        await asyncio.sleep(5)


if __name__ == "__main__":
    asyncio.run(main())
