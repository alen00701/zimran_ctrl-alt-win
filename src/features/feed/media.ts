import messi from './assets/messi.png';
import transfer from './assets/transfer.png';
import liverpool from './assets/liverpool.png';
import lloyd from './assets/lloyd.jpg';
import maradona from './assets/maradona.jpg';
import preview from './assets/preview.png';
import yamalVideo from './assets/videos/yamal.mp4';
import goalyamalVideo from './assets/videos/goalyamal.mp4';
import barsapsglastmatchVideo from './assets/videos/barsapsglastmatch.mp4';
import neymarVideo from './assets/videos/neymar.mp4';
import coutihnoVideo from './assets/videos/coutihno.mp4';
import doueVideo from './assets/videos/doue.mp4';
import oliseVideo from './assets/videos/olise.mp4';
import taarabtVideo from './assets/videos/taarabt.mp4';
import pic_balotelli_why_always_me from './assets/pictures/whyalwaysme.webp';
import pic_messi_hat_trick_clasico_2007 from './assets/pictures/messihattricktoreal.webp';
import pic_batistuta_batigol_roma_2001 from './assets/pictures/batigol.webp';
import pic_kroos_free_kick_sweden_2018 from './assets/pictures/kroosgoalvssweden.webp';
import pic_world_cup_final_2014_germany_argentina from './assets/pictures/finalwc2014.webp';
import pic_messi_world_cup_2022_final from './assets/pictures/messiwinworldcup.webp';
import pic_neymar_never_won_world_cup from './assets/pictures/neymarneverwonwc.webp';
import pic_milan_kaka_beckham_ronaldinho_2009 from './assets/pictures/triokakabeckhamronaldihno.webp';
import pic_leao_milan_real_madrid_2024 from './assets/pictures/happinesinfootball.webp';
import pic_inzaghi_bloody_nose_super_cup_1999 from './assets/pictures/inzaghiplaywithinjury.webp';
import pic_el_clasico_real_madrid_barcelona from './assets/pictures/realvsbarca.webp';

export interface StoryMedia { image?: string; alt: string; credit: string; video?: string; position?: string }
export const storyMedia: Record<string, StoryMedia> = {
  'messi-miami-debut-free-kick': { image: messi, alt: 'Messi celebrates his Inter Miami debut with his teammates', credit: 'Photo: Inter Miami CF', position: '60% center' },
  'messi-signs-with-inter-miami': { image: transfer, alt: 'Lionel Messi wearing his pink Inter Miami jersey', credit: 'Photo: Inter Miami CF' },
  'liverpool-quick-corner-barcelona': { image: liverpool, alt: 'Divock Origi celebrates the decisive goal at Anfield', credit: 'Photo: UEFA' },
  'carli-lloyd-2015-final-hat-trick': { image: lloyd, alt: 'Carli Lloyd celebrates her World Cup final performance', credit: 'Photo: U.S. Soccer' },
  'maradona-1986-england-two-goals': { image: maradona, alt: 'Maradona dribbles through England’s defense in 1986', credit: 'Photo: FIFA' },
  'orlando-city-fc-cincinnati-2026-11-19-preview': { image: preview, alt: 'MLS Cup Playoffs trophy artwork', credit: 'Artwork: MLS' },
  'yamal-clip': { video: yamalVideo, alt: 'Lamine Yamal', credit: 'Team video' },
  'goalyamal-clip': { video: goalyamalVideo, alt: 'A goal by Lamine Yamal', credit: 'Team video' },
  'barsapsglastmatch-clip': { video: barsapsglastmatchVideo, alt: 'Barcelona and Paris Saint-Germain', credit: 'Team video' },
  'neymar-clip': { video: neymarVideo, alt: 'Neymar', credit: 'Team video' },
  'coutihno-clip': { video: coutihnoVideo, alt: 'Philippe Coutinho', credit: 'Team video' },
  'doue-clip': { video: doueVideo, alt: 'Désiré Doué', credit: 'Team video' },
  'olise-clip': { video: oliseVideo, alt: 'Michael Olise', credit: 'Team video' },
  'taarabt-clip': { video: taarabtVideo, alt: 'Adel Taarabt', credit: 'Team video' },
  'balotelli-why-always-me': { image: pic_balotelli_why_always_me, alt: 'Mario Balotelli lifts his Manchester City shirt to show the message “Why always me?”', credit: 'Image: fan edit via TikTok @thatboysomto', position: 'center 30%' },
  'messi-hat-trick-clasico-2007': { image: pic_messi_hat_trick_clasico_2007, alt: 'Lionel Messi in a Barcelona shirt dribbles past Cristiano Ronaldo, who is on his knees, in a Clásico', credit: 'Image: fan edit via TikTok @thatboysomto', position: 'center 30%' },
  'batistuta-batigol-roma-2001': { image: pic_batistuta_batigol_roma_2001, alt: 'Gabriel Batistuta in a Roma shirt, kneeling and pointing after a goal', credit: 'Image: fan edit via TikTok @thatboysomto', position: 'center 30%' },
  'kroos-free-kick-sweden-2018': { image: pic_kroos_free_kick_sweden_2018, alt: 'Toni Kroos’ free kick curls toward the top corner of the Sweden goal as the goalkeeper dives', credit: 'Image: fan edit via TikTok @thatboysomto', position: 'center 30%' },
  'world-cup-final-2014-germany-argentina': { image: pic_world_cup_final_2014_germany_argentina, alt: 'A German player and Lionel Messi tangled together as they challenge for the ball in the 2014 World Cup final', credit: 'Image: fan edit via TikTok @thatboysomto', position: 'center 30%' },
  'messi-world-cup-2022-final': { image: pic_messi_world_cup_2022_final, alt: 'Messi near the corner flag with a packed crowd of Argentina fans behind him', credit: 'Image: fan edit via TikTok @thatboysomto', position: 'center 30%' },
  'neymar-never-won-world-cup': { image: pic_neymar_never_won_world_cup, alt: 'Neymar lying on his back on the pitch in a Brazil kit after the loss to Croatia', credit: 'Image: fan edit via TikTok @thatboysomto', position: 'center 30%' },
  'milan-kaka-beckham-ronaldinho-2009': { image: pic_milan_kaka_beckham_ronaldinho_2009, alt: 'Kaká, David Beckham and Ronaldinho walking side by side in AC Milan shirts, seen from behind', credit: 'Image: fan edit via TikTok @thatboysomto', position: 'center 30%' },
  'leao-milan-real-madrid-2024': { image: pic_leao_milan_real_madrid_2024, alt: 'Rafael Leão of AC Milan runs past a sliding Real Madrid defender', credit: 'Image: fan edit via TikTok @thatboysomto', position: 'center 30%' },
  'inzaghi-bloody-nose-super-cup-1999': { image: pic_inzaghi_bloody_nose_super_cup_1999, alt: 'Simone Inzaghi in a blood-stained Lazio shirt leaving the field', credit: 'Image: fan edit via TikTok @thatboysomto', position: 'center 30%' },
  'el-clasico-real-madrid-barcelona': { image: pic_el_clasico_real_madrid_barcelona, alt: 'Jude Bellingham in a Real Madrid shirt stands over a fallen opponent', credit: 'Image: fan edit via TikTok @thatboysomto', position: 'center 30%' },
};
