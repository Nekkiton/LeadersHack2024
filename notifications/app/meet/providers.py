from abc import ABC, abstractmethod

PROVIDERS = {}

class MeetProvider(ABC):
    __url = "Не удалось создать"

    @abstractmethod
    def create_meet_link(self, info) -> str:
        pass

def register_provider(provider_name):
    def decorator(fn):
        PROVIDERS[provider_name] = fn()
        return fn
    return decorator

def get_provider(provider_name) -> MeetProvider:
    return PROVIDERS.get(provider_name)