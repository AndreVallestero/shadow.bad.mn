# pip install gTTS pydub
# make sure ffmpeg and ffprobe are in the same dir
from gtts import gTTS
from pydub import AudioSegment
  
texts = [ "front-left", "front", "front-right",
          "left", "center", "right",
          "back-left", "back", "back-right" ]

for text in texts:
    tts_object = gTTS(text=text, lang='en', slow=False)
    tts_object.speed = 1.5 # any faster is unintelligible
    tts_object.save('temp.mp3')
    audio = AudioSegment.from_mp3('temp.mp3')
    audio += 6 # amplify before speedup for better quality, any more than 6 clips
    audio = audio.speedup(playback_speed=1.5)
    audio.export(f"{text}.mp3", format="mp3")

import os
os.remove("temp.mp3")
