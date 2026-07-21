# Web Audio Modifications

## Selected anchors

The Guitar Companion fretboard covers standard tuning from open low E through fret 12 on high E (MIDI 40–76). The selected source regions are the complete set of SFZ regions intersecting that range:

| Output | Source sample | Root MIDI | Covered MIDI |
| --- | --- | ---: | ---: |
| `F2.ogg` | `F2_s1_01.wav` | 41 | 40–42 |
| `A2.ogg` | `A2_s2_01.wav` | 45 | 43–46 |
| `C3.ogg` | `C3_s2_02.wav` | 48 | 47–49 |
| `E3.ogg` | `E3_s3_01.wav` | 52 | 50–53 |
| `G3.ogg` | `G3_s4_01.wav` | 55 | 54–56 |
| `B3.ogg` | `B3_s5_01.wav` | 59 | 57–61 |
| `E4.ogg` | `E4_s6_01.wav` | 64 | 62–65 |
| `G4.ogg` | `G4_s6_01.wav` | 67 | 66–69 |
| `B4.ogg` | `B4_s6_01.wav` | 71 | 70–72 |
| `D5.ogg` | `D5_s6_01.wav` | 74 | 73–76 |

## Conversion

- Tool: VideoLAN VLC 3.0.17.4, Vorbis encoder and Ogg muxer.
- Input: mono, signed 16-bit PCM WAV at 44,100 Hz.
- Output: mono Ogg Vorbis at 44,100 Hz, nominal bitrate 128,000 bit/s. The Vorbis stream leaves maximum and minimum bitrate unset, so rate allocation remains encoder-managed.
- VLC transcode parameters: `acodec=vorb,ab=128,channels=1,samplerate=44100`; Ogg file muxing.
- Output location: `outputs/assets/audio/electric/`.
- No gain normalization, ReplayGain, limiter, compressor, dynamic-range processing, resampling, channel remix, or other audio filter was applied.
- No head-silence or tail-silence trimming was requested. Source pick attacks and full encoder-produced tails were retained.
- SFZ loop points remain recorded in `SAMPLE_MANIFEST.json`; they are not embedded as loop metadata in the Ogg files.

## Verification

- All ten Ogg files identify as mono Vorbis at 44,100 Hz with a nominal bitrate of 128,000 bit/s.
- Decode comparison against the pristine PCM sources measured pick-attack onset deltas from -2.902 ms to +0.204 ms.
- Peak-level deltas were -0.034 dB to +0.069 dB and RMS-level deltas were +0.030 dB to +0.060 dB; no dynamics normalization was observed.
- VLC's encoder/muxer produced decoded tails 70.952–109.025 ms shorter than the WAV frame counts. This was encoder EOF behavior, not an explicit silence-trimming step, and it did not remove the natural pick attack.
