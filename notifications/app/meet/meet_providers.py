import os.path
from requests import post
from asyncio.log import logger

from google.apps import meet_v2
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow

from app.settings import Settings
from app.meet.providers import MeetProvider, register_provider


class GoogleMeetProvider(MeetProvider):
    # If modifying these scopes, delete the file token.json.
    __SCOPES = ['https://www.googleapis.com/auth/meetings.space.created']
    __creds = None
    __token_file = Settings.MEET_CREDENTIALS_PATH + 'token.json'
    __creds_file = Settings.MEET_CREDENTIALS_PATH + 'credentials.json'

    def __init__(self):
        MeetProvider.__init__(self)
        if os.path.exists(self.__token_file):
            self.__creds = Credentials.from_authorized_user_file(self.__token_file, self.__SCOPES)
        # If there are no (valid) credentials available, let the user log in.
        if not self.__creds:
            flow = InstalledAppFlow.from_client_secrets_file(self.__creds_file, self.__SCOPES)
            self.__creds = flow.run_local_server(port=0)
            with open(self.__token_file, 'w') as token:
                token.write(self.__creds.to_json())

    def __refresh_token_if_needed(self):
        if not self.__creds.valid and self.__creds.expired and self.__creds.refresh_token:
            self.__creds.refresh(Request())
            with open(self.__token_file, 'w') as token:
                token.write(self.__creds.to_json())

    def create_meet_link(self) -> str:
        try:
            self.__refresh_token_if_needed()
            client = meet_v2.SpacesServiceClient(credentials=self.__creds)
            request = meet_v2.CreateSpaceRequest()
            response = client.create_space(request=request)

            self.__url = response.meeting_uri
            logger.info(f'Link created: {self.__url}')

        except Exception as error:
            logger.error(error)

        return self.__url


class ZoomProvider(MeetProvider):

    __meeting_details = {
        "topic": "Interview",
        "type": 1,
        "duration": "45",
        "settings": {
            "host_video": "true",
            "participant_video": "true",
            "join_before_host": "true",
            "mute_upon_entry": "true",
            "watermark": "true",
            "audio": "voip",
            "auto_recording": "cloud"
        }
    }

    __auth_token_url = "https://zoom.us/oauth/token"
    __api_base_url = "https://api.zoom.us/v2"

    def __generate_token(self):
        data = {
        "grant_type": "account_credentials",
        "account_id": Settings.ZOOM_ACCOUNT_ID,
        "client_secret": Settings.ZOOM_CLIENT_SECRET
        }
        response = post(self.__auth_token_url, 
                                 auth=(
                                     Settings.ZOOM_CLIENT_ID,
                                     Settings.ZOOM_CLIENT_SECRET
                                 ), 
                                 data=data)
        
        if response.status_code != 200:
            logger.error(response.status_code, response.content.decode("utf-8"))

        return response.json().get("access_token", "")

    def create_meet_link(self) -> str:
        try:
            headers = {
                'authorization': 'Bearer ' + self.__generate_token(),
                'content-type': 'application/json'
            }
            response = post(
                f"{self.__api_base_url}/users/me/meetings",
                headers=headers,
                json=self.__meeting_details
            )

            if response.status_code != 201:
                logger.error(response.status_code, response.content.decode("utf-8"))
            response_json = response.json()
            self.__url = response_json["join_url"]
            # meeting_password = response_json["password"]
            logger.info(f'Link created: {self.__url}')
        except Exception as error:
            logger.error(error)

        return self.__url


class TelemostProvider(MeetProvider):

    def create_meet_link(self) -> str:
        response = post(
            url="https://cloud-api.yandex.net/v1/telemost-api/conferences",
            headers={"Authorization": "OAuth " + Settings.TELEMOST_API},
            json={"access_level": "PUBLIC",}
        )

        if response.status_code != 201:
            logger.error(response.status_code, response.content.decode("utf-8"))

        self.__url = response.json().get("join_url", "Не удалось создать")

        return self.__url


@register_provider('googlemeet')
def meet_provider():
    return GoogleMeetProvider()

@register_provider('telemost')
def telemost_provider():
    return TelemostProvider()

@register_provider('zoom')
def zoom_provider():
    return ZoomProvider()
