import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, Animated, Easing, Dimensions, Platform,
} from 'react-native';

// ═══════════════════════════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════════════════════════
const T = {
  bg:       '#0a0015',
  bgCard:   '#12002a',
  bgInput:  '#1a0035',
  gold:     '#ffd700',
  purple:   '#9b59b6',
  pink:     '#ff6b9d',
  blue:     '#4fc3f7',
  text:     '#f0e6ff',
  textDim:  '#8a7a9a',
  border:   '#2a1045',
};

const { width: SW } = Dimensions.get('window');

// ═══════════════════════════════════════════════════════════════
//  ZODIAC DATA
// ═══════════════════════════════════════════════════════════════
const ZODIACS = [
  { sign:'Aries',       symbol:'♈', dates:'Mar 21 - Apr 19', element:'Fire',  color:'#ff4444' },
  { sign:'Taurus',      symbol:'♉', dates:'Apr 20 - May 20', element:'Earth', color:'#44bb44' },
  { sign:'Gemini',      symbol:'♊', dates:'May 21 - Jun 20', element:'Air',   color:'#ffcc00' },
  { sign:'Cancer',      symbol:'♋', dates:'Jun 21 - Jul 22', element:'Water', color:'#4488ff' },
  { sign:'Leo',         symbol:'♌', dates:'Jul 23 - Aug 22', element:'Fire',  color:'#ff8800' },
  { sign:'Virgo',       symbol:'♍', dates:'Aug 23 - Sep 22', element:'Earth', color:'#88cc44' },
  { sign:'Libra',       symbol:'♎', dates:'Sep 23 - Oct 22', element:'Air',   color:'#ff88cc' },
  { sign:'Scorpio',     symbol:'♏', dates:'Oct 23 - Nov 21', element:'Water', color:'#aa2244' },
  { sign:'Sagittarius', symbol:'♐', dates:'Nov 22 - Dec 21', element:'Fire',  color:'#ff6622' },
  { sign:'Capricorn',   symbol:'♑', dates:'Dec 22 - Jan 19', element:'Earth', color:'#556677' },
  { sign:'Aquarius',    symbol:'♒', dates:'Jan 20 - Feb 18', element:'Air',   color:'#44ccff' },
  { sign:'Pisces',      symbol:'♓', dates:'Feb 19 - Mar 20', element:'Water', color:'#8844ff' },
];

const MOON_SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const RISING_SIGNS = [...MOON_SIGNS];

// ═══════════════════════════════════════════════════════════════
//  HOROSCOPE CONTENT
// ═══════════════════════════════════════════════════════════════
const HOROSCOPES = {
  Aries:       { daily:'The stars align in your favor today. Your natural leadership shines bright — take charge of a situation you\'ve been hesitant about. Lucky number: 7. Lucky color: Red.',
                 weekly:'This week brings exciting opportunities in your career. Stay open to unexpected collaborations. Mid-week may bring emotional intensity — trust your instincts.',
                 monthly:'March is a powerful month for Aries. New beginnings are on the horizon, especially in personal relationships. Financial decisions made now will have lasting impact.' },
  Taurus:      { daily:'Venus blesses your interactions today. Focus on creative projects and financial planning. A pleasant surprise may arrive from an old friend. Lucky number: 4.',
                 weekly:'Stability is your theme this week. Avoid impulsive spending. A romantic connection deepens significantly around Thursday.',
                 monthly:'Your patience pays off this month. Career recognition is likely. Focus on health and wellness routines for lasting benefits.' },
  Gemini:      { daily:'Mercury sharpens your mind today. Communication flows effortlessly — ideal for negotiations and important conversations. Lucky color: Yellow.',
                 weekly:'Social connections multiply this week. A brilliant idea strikes mid-week. Be careful not to overcommit your time.',
                 monthly:'Gemini shines in all social settings this month. Travel opportunities arise. A creative project reaches an exciting milestone.' },
  Cancer:      { daily:'The Moon, your ruler, brings emotional clarity today. Trust your intuition in all matters. Home and family bring joy. Lucky number: 2.',
                 weekly:'Family matters take center stage. Financial caution advised early week. Weekend brings warmth and connection.',
                 monthly:'Deep emotional healing occurs this month. A long-standing issue finally resolves. New home or living situation may be on the cards.' },
  Leo:         { daily:'The Sun energizes your spirit today. Your charisma is at its peak — perfect for presentations or first impressions. Lucky color: Gold.',
                 weekly:'Recognition and appreciation flow your way. Leadership opportunities arise. Stay humble while embracing your natural spotlight.',
                 monthly:'Leo roars with confidence this month. Career achievements stack up. Love life sparkles — single Leos may find something special.' },
  Virgo:       { daily:'Mercury brings analytical power today. Detail-oriented tasks flow smoothly. A health matter benefits from attention. Lucky number: 5.',
                 weekly:'Organization leads to breakthroughs. A colleague offers valuable support. Health and wellness investments pay dividends.',
                 monthly:'Practical magic unfolds for Virgo. Financial planning yields results. A relationship deepens through honest communication.' },
  Libra:       { daily:'Venus graces your relationships today. Harmony prevails in partnerships. An artistic or aesthetic decision brings satisfaction. Lucky color: Pink.',
                 weekly:'Balance is restored in your life. Legal or contractual matters progress favorably. Creative endeavors flourish.',
                 monthly:'Libra finds equilibrium this month. Partnership matters — both romantic and professional — reach new levels. Social life blossoms.' },
  Scorpio:     { daily:'Pluto intensifies your perception today. Hidden truths come to light. Trust your deep intuition over surface appearances. Lucky number: 8.',
                 weekly:'Transformation is your theme. Release what no longer serves you. Financial insights prove valuable.',
                 monthly:'Scorpio undergoes powerful renewal this month. Career matters intensify positively. A secret admirer may reveal themselves.' },
  Sagittarius: { daily:'Jupiter expands your horizons today. Adventure calls — answer it. A philosophical insight changes your perspective. Lucky color: Purple.',
                 weekly:'Learning and exploration dominate. Travel plans crystallize. An optimistic outlook attracts abundance.',
                 monthly:'Freedom and expansion mark this month. Educational pursuits flourish. International connections prove valuable.' },
  Capricorn:   { daily:'Saturn rewards your discipline today. Hard work pays visible dividends. An authority figure takes positive notice. Lucky number: 10.',
                 weekly:'Ambition drives success. Financial planning yields stability. Weekend offers well-deserved relaxation.',
                 monthly:'Capricorn climbs higher this month. Professional goals within reach. Structure in daily routines creates lasting wellbeing.' },
  Aquarius:    { daily:'Uranus sparks innovation today. An unconventional solution solves a persistent problem. Community connections energize. Lucky color: Blue.',
                 weekly:'Humanitarian instincts guide important decisions. Technology and innovation favor you. Friendships deepen meaningfully.',
                 monthly:'Aquarius leads with vision this month. A group project or community initiative gains momentum. Personal freedom and relationships balance beautifully.' },
  Pisces:      { daily:'Neptune heightens your sensitivity today. Creative and spiritual pursuits flourish. Dreams may carry important messages. Lucky number: 7.',
                 weekly:'Intuition is your superpower. Artistic projects reach beautiful conclusions. A spiritual practice brings peace.',
                 monthly:'Pisces swims in beautiful waters this month. Creative gifts are recognized. Emotional connections deepen profoundly.' },
};

const GEMSTONES = {
  Fire:  ['Ruby — for passion and energy', 'Carnelian — for courage', 'Sunstone — for vitality'],
  Earth: ['Emerald — for abundance', 'Jade — for harmony', 'Malachite — for transformation'],
  Air:   ['Aquamarine — for clarity', 'Citrine — for joy', 'Clear Quartz — for amplification'],
  Water: ['Moonstone — for intuition', 'Pearl — for wisdom', 'Amethyst — for spiritual growth'],
};

const REMEDIES = {
  Fire:  ['Meditate facing East at sunrise', 'Wear red or orange on Tuesdays', 'Donate to fire-related charities'],
  Earth: ['Walk barefoot on grass daily', 'Keep plants in your home', 'Practice gratitude journaling'],
  Air:   ['Practice deep breathing exercises', 'Wear yellow or green on Wednesdays', 'Read and learn something new daily'],
  Water: ['Moon gazing on full moon nights', 'Drink water with intention', 'Wear silver on Mondays'],
};

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════
function getZodiacFromDOB(day, month) {
  const d = parseInt(day), m = parseInt(month);
  if((m===3&&d>=21)||(m===4&&d<=19)) return ZODIACS[0];
  if((m===4&&d>=20)||(m===5&&d<=20)) return ZODIACS[1];
  if((m===5&&d>=21)||(m===6&&d<=20)) return ZODIACS[2];
  if((m===6&&d>=21)||(m===7&&d<=22)) return ZODIACS[3];
  if((m===7&&d>=23)||(m===8&&d<=22)) return ZODIACS[4];
  if((m===8&&d>=23)||(m===9&&d<=22)) return ZODIACS[5];
  if((m===9&&d>=23)||(m===10&&d<=22)) return ZODIACS[6];
  if((m===10&&d>=23)||(m===11&&d<=21)) return ZODIACS[7];
  if((m===11&&d>=22)||(m===12&&d<=21)) return ZODIACS[8];
  if((m===12&&d>=22)||(m===1&&d<=19)) return ZODIACS[9];
  if((m===1&&d>=20)||(m===2&&d<=18)) return ZODIACS[10];
  return ZODIACS[11];
}

function getMoonSign(day, month, year) {
  const idx = (parseInt(day) + parseInt(month) + parseInt(year)) % 12;
  return MOON_SIGNS[idx];
}

function getRisingSign(hour, minute, day, month) {
  const idx = (parseInt(hour||0) + parseInt(minute||0) + parseInt(day) + parseInt(month)) % 12;
  return RISING_SIGNS[idx];
}

// ═══════════════════════════════════════════════════════════════
//  ANIMATED STAR BACKGROUND
// ═══════════════════════════════════════════════════════════════
function StarBackground() {
  const stars = useRef(
    Array.from({length:30},(_,i)=>({
      x:(i*137)%SW,
      y:(i*97)%700,
      size:1+(i%3),
      opacity:new Animated.Value(0.2+(i%5)*0.15),
    }))
  ).current;

  useEffect(()=>{
    stars.forEach((star,i)=>{
      Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity,{toValue:1,duration:1500+(i%7)*300,useNativeDriver:true}),
          Animated.timing(star.opacity,{toValue:0.2,duration:1500+(i%7)*300,useNativeDriver:true}),
        ])
      ).start();
    });
  },[]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((s,i)=>(
        <Animated.View key={i} style={{
          position:'absolute', left:s.x, top:s.y,
          width:s.size, height:s.size, borderRadius:s.size/2,
          backgroundColor:'#ffffff', opacity:s.opacity,
        }}/>
      ))}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  FADE SCREEN
// ═══════════════════════════════════════════════════════════════
function FadeScreen({children}) {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    Animated.timing(fade,{toValue:1,duration:400,useNativeDriver:true}).start();
  },[]);
  return <Animated.View style={{flex:1,opacity:fade}}>{children}</Animated.View>;
}

// ═══════════════════════════════════════════════════════════════
//  ONBOARDING SCREEN
// ═══════════════════════════════════════════════════════════════
function OnboardingScreen({onDone}) {
  const [step, setStep]     = useState(0);
  const [name, setName]     = useState('');
  const [day, setDay]       = useState('');
  const [month, setMonth]   = useState('');
  const [year, setYear]     = useState('');
  const [hour, setHour]     = useState('');
  const [minute, setMinute] = useState('');
  const [place, setPlace]   = useState('');
  const [gender, setGender] = useState('');

  const steps = [
    { title:'Welcome to\nAstroAI ✨', subtitle:'Your personal AI astrologer', content: (
      <View style={{alignItems:'center',marginTop:20}}>
        <Text style={s.zodiacBig}>🔮</Text>
        <Text style={[s.bodyText,{textAlign:'center',marginTop:16}]}>
          Discover your cosmic destiny through the ancient wisdom of astrology, powered by modern AI
        </Text>
        <TouchableOpacity style={[s.goldBtn,{marginTop:32}]} onPress={()=>setStep(1)}>
          <Text style={s.goldBtnText}>✨ Begin My Journey</Text>
        </TouchableOpacity>
      </View>
    )},
    { title:'What\'s your name?', subtitle:'Let the stars know you', content: (
      <View style={{alignItems:'center',marginTop:20,width:'100%'}}>
        <TextInput
          style={s.input} placeholder="Your full name"
          placeholderTextColor={T.textDim} value={name}
          onChangeText={setName}
        />
        <View style={{flexDirection:'row',gap:12,marginTop:20}}>
          {['Male','Female','Other'].map(g=>(
            <TouchableOpacity key={g} style={[s.chipBtn, gender===g&&{borderColor:T.gold,backgroundColor:T.bgCard}]}
              onPress={()=>setGender(g)}>
              <Text style={[s.chipText,gender===g&&{color:T.gold}]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {name.trim().length>=2&&gender&&(
          <TouchableOpacity style={[s.goldBtn,{marginTop:32}]} onPress={()=>setStep(2)}>
            <Text style={s.goldBtnText}>Continue →</Text>
          </TouchableOpacity>
        )}
      </View>
    )},
    { title:'Date of Birth', subtitle:'Your cosmic birth signature', content: (
      <View style={{alignItems:'center',marginTop:20,width:'100%'}}>
        <View style={{flexDirection:'row',gap:10}}>
          <TextInput style={[s.input,{width:70}]} placeholder="DD" placeholderTextColor={T.textDim}
            value={day} onChangeText={setDay} keyboardType="numeric" maxLength={2}/>
          <TextInput style={[s.input,{width:70}]} placeholder="MM" placeholderTextColor={T.textDim}
            value={month} onChangeText={setMonth} keyboardType="numeric" maxLength={2}/>
          <TextInput style={[s.input,{width:100}]} placeholder="YYYY" placeholderTextColor={T.textDim}
            value={year} onChangeText={setYear} keyboardType="numeric" maxLength={4}/>
        </View>
        {day&&month&&year&&year.length===4&&(
          <>
            <View style={s.previewCard}>
              {(()=>{
                const z = getZodiacFromDOB(day,month);
                return <>
                  <Text style={[s.zodiacBig,{fontSize:48}]}>{z.symbol}</Text>
                  <Text style={[s.goldText,{fontSize:22,marginTop:8}]}>{z.sign}</Text>
                  <Text style={{color:z.color,fontSize:13}}>{z.element} Sign</Text>
                  <Text style={{color:T.textDim,fontSize:12,marginTop:4}}>{z.dates}</Text>
                </>;
              })()}
            </View>
            <TouchableOpacity style={[s.goldBtn,{marginTop:16}]} onPress={()=>setStep(3)}>
              <Text style={s.goldBtnText}>Continue →</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    )},
    { title:'Birth Time & Place', subtitle:'For precise cosmic alignment', content: (
      <View style={{alignItems:'center',marginTop:20,width:'100%'}}>
        <Text style={{color:T.textDim,fontSize:12,marginBottom:8}}>Birth Time (optional but more accurate)</Text>
        <View style={{flexDirection:'row',gap:10}}>
          <TextInput style={[s.input,{width:80}]} placeholder="HH" placeholderTextColor={T.textDim}
            value={hour} onChangeText={setHour} keyboardType="numeric" maxLength={2}/>
          <TextInput style={[s.input,{width:80}]} placeholder="MM" placeholderTextColor={T.textDim}
            value={minute} onChangeText={setMinute} keyboardType="numeric" maxLength={2}/>
        </View>
        <TextInput style={[s.input,{marginTop:16,width:'90%'}]} placeholder="Birth city (e.g. Mumbai)"
          placeholderTextColor={T.textDim} value={place} onChangeText={setPlace}/>
        <TouchableOpacity style={[s.goldBtn,{marginTop:24}]}
          onPress={()=>onDone({name,day,month,year,hour,minute,place,gender})}>
          <Text style={s.goldBtnText}>🌟 Reveal My Chart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop:12}} onPress={()=>onDone({name,day,month,year,hour:'12',minute:'0',place:'Unknown',gender})}>
          <Text style={{color:T.textDim,fontSize:13}}>Skip — I don't know my birth time</Text>
        </TouchableOpacity>
      </View>
    )},
  ];

  const current = steps[step];

  return (
    <FadeScreen>
      <View style={s.container}>
        <StarBackground/>
        <ScrollView contentContainerStyle={{alignItems:'center',paddingVertical:40,paddingHorizontal:24}} showsVerticalScrollIndicator={false}>
          {/* Progress dots */}
          <View style={{flexDirection:'row',gap:8,marginBottom:24}}>
            {steps.map((_,i)=>(
              <View key={i} style={{width:i===step?20:8,height:8,borderRadius:4,backgroundColor:i<=step?T.gold:T.border}}/>
            ))}
          </View>
          <Text style={s.titleText}>{current.title}</Text>
          <Text style={s.subtitle}>{current.subtitle}</Text>
          {current.content}
        </ScrollView>
      </View>
    </FadeScreen>
  );
}

// ═══════════════════════════════════════════════════════════════
//  HOME SCREEN
// ═══════════════════════════════════════════════════════════════
function HomeScreen({profile, onNavigate}) {
  const zodiac   = getZodiacFromDOB(profile.day, profile.month);
  const moonSign = getMoonSign(profile.day, profile.month, profile.year);
  const rising   = getRisingSign(profile.hour, profile.minute, profile.day, profile.month);
  const horoscope = HOROSCOPES[zodiac.sign];
  const pulse    = useRef(new Animated.Value(1)).current;

  useEffect(()=>{
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse,{toValue:1.05,duration:2000,useNativeDriver:true}),
        Animated.timing(pulse,{toValue:1,duration:2000,useNativeDriver:true}),
      ])
    ).start();
  },[]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});

  return (
    <FadeScreen>
      <View style={s.container}>
        <StarBackground/>
        <ScrollView contentContainerStyle={{paddingBottom:100}} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={s.header}>
            <View>
              <Text style={{color:T.textDim,fontSize:13}}>{dateStr}</Text>
              <Text style={[s.goldText,{fontSize:20}]}>Namaste, {profile.name} 🙏</Text>
            </View>
            <TouchableOpacity onPress={()=>onNavigate('profile')}>
              <View style={s.avatarCircle}>
                <Text style={{fontSize:22}}>{zodiac.symbol}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Main Zodiac Card */}
          <Animated.View style={[s.zodiacCard,{transform:[{scale:pulse}],borderColor:zodiac.color}]}>
            <Text style={{fontSize:56}}>{zodiac.symbol}</Text>
            <Text style={[s.goldText,{fontSize:28,marginTop:4}]}>{zodiac.sign}</Text>
            <Text style={{color:zodiac.color,fontSize:14}}>{zodiac.element} Sign · {zodiac.dates}</Text>
            <View style={{flexDirection:'row',gap:16,marginTop:12}}>
              <View style={{alignItems:'center'}}>
                <Text style={{color:T.textDim,fontSize:11}}>Moon Sign</Text>
                <Text style={{color:T.blue,fontSize:14,fontWeight:'700'}}>🌙 {moonSign}</Text>
              </View>
              <View style={{width:1,backgroundColor:T.border}}/>
              <View style={{alignItems:'center'}}>
                <Text style={{color:T.textDim,fontSize:11}}>Rising Sign</Text>
                <Text style={{color:T.pink,fontSize:14,fontWeight:'700'}}>⬆️ {rising}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Today's Horoscope */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>✨ Today's Horoscope</Text>
            <View style={s.card}>
              <Text style={{color:T.text,fontSize:14,lineHeight:22}}>{horoscope.daily}</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>🔮 Explore</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>
              {[
                {icon:'📅', label:'Horoscope',  screen:'horoscope'},
                {icon:'💑', label:'Kundli',      screen:'kundli'},
                {icon:'💎', label:'Remedies',    screen:'remedies'},
                {icon:'🌙', label:'Moon Reading',screen:'moon'},
                {icon:'🤚', label:'Palm Reading', screen:'palm'},
                {icon:'💬', label:'AI Astrologer',screen:'chat'},
              ].map(item=>(
                <TouchableOpacity key={item.screen} style={s.quickBtn} onPress={()=>onNavigate(item.screen)}>
                  <Text style={{fontSize:28}}>{item.icon}</Text>
                  <Text style={{color:T.text,fontSize:11,marginTop:4,fontWeight:'600'}}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Gemstone of the Day */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>💎 Your Gemstones</Text>
            <View style={s.card}>
              {GEMSTONES[zodiac.element].map((g,i)=>(
                <Text key={i} style={{color:T.text,fontSize:13,marginBottom:8}}>• {g}</Text>
              ))}
            </View>
          </View>

        </ScrollView>

        {/* Bottom Nav */}
        <View style={s.bottomNav}>
          {[
            {icon:'🏠', label:'Home',     screen:'home'},
            {icon:'📅', label:'Horoscope',screen:'horoscope'},
            {icon:'💬', label:'AI Chat',  screen:'chat'},
            {icon:'💑', label:'Kundli',   screen:'kundli'},
            {icon:'👤', label:'Profile',  screen:'profile'},
          ].map(item=>(
            <TouchableOpacity key={item.screen} style={s.navItem} onPress={()=>onNavigate(item.screen)}>
              <Text style={{fontSize:22}}>{item.icon}</Text>
              <Text style={{color:T.textDim,fontSize:10}}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </FadeScreen>
  );
}

// ═══════════════════════════════════════════════════════════════
//  HOROSCOPE SCREEN
// ═══════════════════════════════════════════════════════════════
function HoroscopeScreen({profile, onBack}) {
  const [period, setPeriod] = useState('daily');
  const zodiac = getZodiacFromDOB(profile.day, profile.month);
  const horoscope = HOROSCOPES[zodiac.sign];

  return (
    <FadeScreen>
      <View style={s.container}>
        <StarBackground/>
        <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:40}} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={{marginTop:50,marginBottom:10}} onPress={onBack}>
            <Text style={{color:T.textDim,fontSize:15}}>← Back</Text>
          </TouchableOpacity>
          <Text style={s.titleText}>{zodiac.symbol} {zodiac.sign}</Text>
          <Text style={s.subtitle}>Your Horoscope</Text>

          {/* Period selector */}
          <View style={{flexDirection:'row',gap:10,marginVertical:20}}>
            {['daily','weekly','monthly'].map(p=>(
              <TouchableOpacity key={p} style={[s.chipBtn,period===p&&{borderColor:T.gold,backgroundColor:T.bgCard}]}
                onPress={()=>setPeriod(p)}>
                <Text style={[s.chipText,period===p&&{color:T.gold}]}>{p.charAt(0).toUpperCase()+p.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.card}>
            <Text style={{color:T.text,fontSize:15,lineHeight:24}}>{horoscope[period]}</Text>
          </View>

          {/* All zodiac signs */}
          <Text style={[s.sectionTitle,{marginTop:24}]}>All Signs</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>
            {ZODIACS.map(z=>(
              <View key={z.sign} style={[s.zodiacChip,{borderColor:z.color}]}>
                <Text style={{fontSize:20}}>{z.symbol}</Text>
                <Text style={{color:z.color,fontSize:10,marginTop:2}}>{z.sign}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </FadeScreen>
  );
}

// ═══════════════════════════════════════════════════════════════
//  KUNDLI / COMPATIBILITY SCREEN
// ═══════════════════════════════════════════════════════════════
function KundliScreen({profile, onBack}) {
  const [partnerDay,   setPartnerDay]   = useState('');
  const [partnerMonth, setPartnerMonth] = useState('');
  const [partnerYear,  setPartnerYear]  = useState('');
  const [partnerName,  setPartnerName]  = useState('');
  const [result,       setResult]       = useState(null);

  const myZodiac = getZodiacFromDOB(profile.day, profile.month);

  function checkCompatibility() {
    const partnerZodiac = getZodiacFromDOB(partnerDay, partnerMonth);
    const score = ((ZODIACS.indexOf(myZodiac) + ZODIACS.indexOf(partnerZodiac) + 7) % 10) + 1;
    const compatibility = score >= 8 ? 'Excellent' : score >= 6 ? 'Good' : score >= 4 ? 'Moderate' : 'Challenging';
    const color = score >= 8 ? '#44ff44' : score >= 6 ? T.gold : score >= 4 ? T.pink : '#ff4444';
    setResult({partnerZodiac, score, compatibility, color,
      message: score >= 8
        ? `${myZodiac.sign} and ${partnerZodiac.sign} share a deeply harmonious bond. Your energies complement each other beautifully.`
        : score >= 6
        ? `${myZodiac.sign} and ${partnerZodiac.sign} have a good foundation. With understanding, this relationship thrives.`
        : score >= 4
        ? `${myZodiac.sign} and ${partnerZodiac.sign} face some challenges but growth is possible through communication.`
        : `${myZodiac.sign} and ${partnerZodiac.sign} have contrasting energies. Patience and compromise are key.`
    });
  }

  return (
    <FadeScreen>
      <View style={s.container}>
        <StarBackground/>
        <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:40}} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={{marginTop:50,marginBottom:10}} onPress={onBack}>
            <Text style={{color:T.textDim,fontSize:15}}>← Back</Text>
          </TouchableOpacity>
          <Text style={s.titleText}>💑 Kundli Match</Text>
          <Text style={s.subtitle}>Cosmic Compatibility</Text>

          {/* Your sign */}
          <View style={[s.card,{flexDirection:'row',alignItems:'center',gap:12,marginTop:20}]}>
            <Text style={{fontSize:36}}>{myZodiac.symbol}</Text>
            <View>
              <Text style={{color:T.textDim,fontSize:12}}>Your Sign</Text>
              <Text style={[s.goldText,{fontSize:18}]}>{profile.name} · {myZodiac.sign}</Text>
            </View>
          </View>

          <Text style={[s.sectionTitle,{marginTop:20}]}>Partner's Details</Text>
          <TextInput style={s.input} placeholder="Partner's name" placeholderTextColor={T.textDim}
            value={partnerName} onChangeText={setPartnerName}/>
          <View style={{flexDirection:'row',gap:10,marginTop:12}}>
            <TextInput style={[s.input,{width:70}]} placeholder="DD" placeholderTextColor={T.textDim}
              value={partnerDay} onChangeText={setPartnerDay} keyboardType="numeric" maxLength={2}/>
            <TextInput style={[s.input,{width:70}]} placeholder="MM" placeholderTextColor={T.textDim}
              value={partnerMonth} onChangeText={setPartnerMonth} keyboardType="numeric" maxLength={2}/>
            <TextInput style={[s.input,{width:100}]} placeholder="YYYY" placeholderTextColor={T.textDim}
              value={partnerYear} onChangeText={setPartnerYear} keyboardType="numeric" maxLength={4}/>
          </View>

          {partnerDay&&partnerMonth&&partnerYear&&partnerYear.length===4&&(
            <TouchableOpacity style={[s.goldBtn,{marginTop:20}]} onPress={checkCompatibility}>
              <Text style={s.goldBtnText}>🔮 Check Compatibility</Text>
            </TouchableOpacity>
          )}

          {result&&(
            <View style={[s.card,{marginTop:20,alignItems:'center'}]}>
              <View style={{flexDirection:'row',alignItems:'center',gap:16}}>
                <Text style={{fontSize:40}}>{myZodiac.symbol}</Text>
                <Text style={{color:T.gold,fontSize:24}}>♥</Text>
                <Text style={{fontSize:40}}>{result.partnerZodiac.symbol}</Text>
              </View>
              <Text style={[s.goldText,{fontSize:48,marginTop:8}]}>{result.score}/10</Text>
              <Text style={{color:result.color,fontSize:20,fontWeight:'800'}}>{result.compatibility}</Text>
              <Text style={{color:T.text,fontSize:13,textAlign:'center',marginTop:12,lineHeight:20}}>{result.message}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </FadeScreen>
  );
}

// ═══════════════════════════════════════════════════════════════
//  REMEDIES SCREEN
// ═══════════════════════════════════════════════════════════════
function RemediesScreen({profile, onBack}) {
  const zodiac = getZodiacFromDOB(profile.day, profile.month);
  const gems = GEMSTONES[zodiac.element];
  const remedies = REMEDIES[zodiac.element];

  return (
    <FadeScreen>
      <View style={s.container}>
        <StarBackground/>
        <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:40}} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={{marginTop:50,marginBottom:10}} onPress={onBack}>
            <Text style={{color:T.textDim,fontSize:15}}>← Back</Text>
          </TouchableOpacity>
          <Text style={s.titleText}>💎 Remedies</Text>
          <Text style={s.subtitle}>For {zodiac.sign} · {zodiac.element} Element</Text>

          <View style={[s.card,{marginTop:20}]}>
            <Text style={s.sectionTitle}>Recommended Gemstones</Text>
            {gems.map((g,i)=>(
              <View key={i} style={{flexDirection:'row',gap:10,marginBottom:12,alignItems:'center'}}>
                <Text style={{fontSize:24}}>💎</Text>
                <Text style={{color:T.text,fontSize:14,flex:1}}>{g}</Text>
              </View>
            ))}
          </View>

          <View style={[s.card,{marginTop:16}]}>
            <Text style={s.sectionTitle}>Daily Remedies</Text>
            {remedies.map((r,i)=>(
              <View key={i} style={{flexDirection:'row',gap:10,marginBottom:12,alignItems:'center'}}>
                <Text style={{fontSize:24}}>🌟</Text>
                <Text style={{color:T.text,fontSize:14,flex:1}}>{r}</Text>
              </View>
            ))}
          </View>

          <View style={[s.card,{marginTop:16}]}>
            <Text style={s.sectionTitle}>Mantras for {zodiac.sign}</Text>
            <Text style={{color:T.gold,fontSize:16,textAlign:'center',marginVertical:12,fontStyle:'italic'}}>
              "Om Namah Shivaya"
            </Text>
            <Text style={{color:T.textDim,fontSize:13,textAlign:'center'}}>
              Chant 108 times daily for cosmic alignment
            </Text>
          </View>
        </ScrollView>
      </View>
    </FadeScreen>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MOON READING SCREEN
// ═══════════════════════════════════════════════════════════════
function MoonScreen({profile, onBack}) {
  const zodiac   = getZodiacFromDOB(profile.day, profile.month);
  const moonSign = getMoonSign(profile.day, profile.month, profile.year);
  const rising   = getRisingSign(profile.hour, profile.minute, profile.day, profile.month);
  const moonZodiac = ZODIACS.find(z=>z.sign===moonSign)||ZODIACS[0];

  return (
    <FadeScreen>
      <View style={s.container}>
        <StarBackground/>
        <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:40}} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={{marginTop:50,marginBottom:10}} onPress={onBack}>
            <Text style={{color:T.textDim,fontSize:15}}>← Back</Text>
          </TouchableOpacity>
          <Text style={s.titleText}>🌙 Moon & Rising</Text>
          <Text style={s.subtitle}>Your inner cosmic blueprint</Text>

          <View style={[s.card,{marginTop:20,alignItems:'center'}]}>
            <Text style={{fontSize:48}}>🌙</Text>
            <Text style={[s.goldText,{fontSize:22,marginTop:8}]}>Moon in {moonSign}</Text>
            <Text style={{color:moonZodiac.color,fontSize:13,marginTop:4}}>{moonZodiac.element} Energy</Text>
            <Text style={{color:T.text,fontSize:13,textAlign:'center',marginTop:12,lineHeight:20}}>
              Your Moon sign reveals your emotional nature and subconscious patterns.
              With Moon in {moonSign}, you process emotions through {moonZodiac.element.toLowerCase()} energy —
              {moonZodiac.element==='Fire'?' passionate and instinctive.'
              :moonZodiac.element==='Earth'?' grounded and practical.'
              :moonZodiac.element==='Air'?' intellectual and communicative.'
              :' intuitive and sensitive.'}
            </Text>
          </View>

          <View style={[s.card,{marginTop:16,alignItems:'center'}]}>
            <Text style={{fontSize:48}}>⬆️</Text>
            <Text style={[s.goldText,{fontSize:22,marginTop:8}]}>Rising in {rising}</Text>
            <Text style={{color:T.text,fontSize:13,textAlign:'center',marginTop:12,lineHeight:20}}>
              Your Rising sign is the mask you wear to the world — how others first perceive you.
              With {rising} rising, you project {ZODIACS.find(z=>z.sign===rising)?.element.toLowerCase()||'cosmic'} energy outward.
            </Text>
          </View>

          <View style={[s.card,{marginTop:16}]}>
            <Text style={s.sectionTitle}>Your Cosmic Trinity</Text>
            {[
              {label:'Sun Sign', value:zodiac.sign, icon:zodiac.symbol, desc:'Your core identity'},
              {label:'Moon Sign', value:moonSign, icon:'🌙', desc:'Your emotional self'},
              {label:'Rising Sign', value:rising, icon:'⬆️', desc:'How others see you'},
            ].map((item,i)=>(
              <View key={i} style={{flexDirection:'row',alignItems:'center',gap:12,marginBottom:16}}>
                <Text style={{fontSize:28}}>{item.icon}</Text>
                <View style={{flex:1}}>
                  <Text style={{color:T.textDim,fontSize:11}}>{item.label}</Text>
                  <Text style={[s.goldText,{fontSize:16}]}>{item.value}</Text>
                  <Text style={{color:T.textDim,fontSize:11}}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </FadeScreen>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PALM READING SCREEN (placeholder for Phase 4)
// ═══════════════════════════════════════════════════════════════
function PalmScreen({onBack}) {
  return (
    <FadeScreen>
      <View style={s.container}>
        <StarBackground/>
        <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24}}>
          <TouchableOpacity style={{position:'absolute',top:50,left:20}} onPress={onBack}>
            <Text style={{color:T.textDim,fontSize:15}}>← Back</Text>
          </TouchableOpacity>
          <Text style={{fontSize:72}}>🤚</Text>
          <Text style={s.titleText}>Palm Reading</Text>
          <Text style={{color:T.textDim,fontSize:14,textAlign:'center',marginTop:12,lineHeight:22}}>
            AI-powered palm reading is coming soon!{'\n\n'}
            Our cosmic AI will analyze your palm lines to reveal your destiny, life path, and fortune.
          </Text>
          <View style={[s.card,{marginTop:24,width:'100%'}]}>
            <Text style={{color:T.gold,fontSize:13,textAlign:'center'}}>✨ Coming in Phase 4 ✨</Text>
            <Text style={{color:T.textDim,fontSize:12,textAlign:'center',marginTop:8}}>
              Premium feature · Unlock with subscription
            </Text>
          </View>
        </View>
      </View>
    </FadeScreen>
  );
}

// ═══════════════════════════════════════════════════════════════
//  AI CHAT SCREEN (placeholder for Phase 2)
// ═══════════════════════════════════════════════════════════════
function ChatScreen({onBack}) {
  return (
    <FadeScreen>
      <View style={s.container}>
        <StarBackground/>
        <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24}}>
          <TouchableOpacity style={{position:'absolute',top:50,left:20}} onPress={onBack}>
            <Text style={{color:T.textDim,fontSize:15}}>← Back</Text>
          </TouchableOpacity>
          <Text style={{fontSize:72}}>💬</Text>
          <Text style={s.titleText}>AI Astrologer</Text>
          <Text style={{color:T.textDim,fontSize:14,textAlign:'center',marginTop:12,lineHeight:22}}>
            Chat with your personal AI astrologer for deep cosmic insights, predictions, and guidance.
          </Text>
          <View style={[s.card,{marginTop:24,width:'100%'}]}>
            <Text style={{color:T.gold,fontSize:13,textAlign:'center'}}>✨ Coming in Phase 2 ✨</Text>
            <Text style={{color:T.textDim,fontSize:12,textAlign:'center',marginTop:8}}>
              Powered by Claude AI
            </Text>
          </View>
        </View>
      </View>
    </FadeScreen>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PROFILE SCREEN
// ═══════════════════════════════════════════════════════════════
function ProfileScreen({profile, onBack, onReset}) {
  const zodiac   = getZodiacFromDOB(profile.day, profile.month);
  const moonSign = getMoonSign(profile.day, profile.month, profile.year);
  const rising   = getRisingSign(profile.hour, profile.minute, profile.day, profile.month);

  return (
    <FadeScreen>
      <View style={s.container}>
        <StarBackground/>
        <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:40}} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={{marginTop:50,marginBottom:10}} onPress={onBack}>
            <Text style={{color:T.textDim,fontSize:15}}>← Back</Text>
          </TouchableOpacity>

          <View style={{alignItems:'center',marginVertical:20}}>
            <View style={[s.avatarCircle,{width:80,height:80,borderRadius:40}]}>
              <Text style={{fontSize:40}}>{zodiac.symbol}</Text>
            </View>
            <Text style={[s.goldText,{fontSize:24,marginTop:12}]}>{profile.name}</Text>
            <Text style={{color:T.textDim,fontSize:13}}>{profile.gender}</Text>
          </View>

          <View style={s.card}>
            {[
              {label:'Sun Sign',    value:`${zodiac.symbol} ${zodiac.sign}`},
              {label:'Moon Sign',   value:`🌙 ${moonSign}`},
              {label:'Rising Sign', value:`⬆️ ${rising}`},
              {label:'Element',     value:zodiac.element},
              {label:'Birth Date',  value:`${profile.day}/${profile.month}/${profile.year}`},
              {label:'Birth Time',  value:profile.hour&&profile.minute ? `${profile.hour}:${profile.minute}` : 'Unknown'},
              {label:'Birth Place', value:profile.place||'Unknown'},
            ].map((item,i)=>(
              <View key={i} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:10,borderBottomWidth:i<6?1:0,borderBottomColor:T.border}}>
                <Text style={{color:T.textDim,fontSize:13}}>{item.label}</Text>
                <Text style={{color:T.text,fontSize:13,fontWeight:'600'}}>{item.value}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[s.goldBtn,{marginTop:24,borderColor:'#ff4444',backgroundColor:'transparent'}]} onPress={onReset}>
            <Text style={[s.goldBtnText,{color:'#ff4444'}]}>🔄 Reset Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </FadeScreen>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [screen,  setScreen]  = useState('onboarding');
  const [profile, setProfile] = useState(null);

  function handleOnboardingDone(data) {
    setProfile(data);
    setScreen('home');
  }

  function navigate(sc) { setScreen(sc); }

  if(screen==='onboarding') return <OnboardingScreen onDone={handleOnboardingDone}/>;
  if(screen==='home')       return <HomeScreen profile={profile} onNavigate={navigate}/>;
  if(screen==='horoscope')  return <HoroscopeScreen profile={profile} onBack={()=>setScreen('home')}/>;
  if(screen==='kundli')     return <KundliScreen profile={profile} onBack={()=>setScreen('home')}/>;
  if(screen==='remedies')   return <RemediesScreen profile={profile} onBack={()=>setScreen('home')}/>;
  if(screen==='moon')       return <MoonScreen profile={profile} onBack={()=>setScreen('home')}/>;
  if(screen==='palm')       return <PalmScreen onBack={()=>setScreen('home')}/>;
  if(screen==='chat')       return <ChatScreen onBack={()=>setScreen('home')}/>;
  if(screen==='profile')    return <ProfileScreen profile={profile} onBack={()=>setScreen('home')} onReset={()=>setScreen('onboarding')}/>;
  return null;
}

// ═══════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════
const s = StyleSheet.create({
  container:   {flex:1, backgroundColor:T.bg},
  header:      {flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, paddingTop:50, paddingBottom:16},
  titleText:   {color:T.text, fontSize:28, fontWeight:'800', textAlign:'center', lineHeight:36},
  subtitle:    {color:T.textDim, fontSize:14, textAlign:'center', marginTop:4},
  goldText:    {color:T.gold, fontWeight:'800'},
  bodyText:    {color:T.text, fontSize:15, lineHeight:24},
  input:       {backgroundColor:T.bgInput, color:T.text, borderRadius:12, paddingHorizontal:16, paddingVertical:12, fontSize:15, borderWidth:1, borderColor:T.border, width:'90%'},
  goldBtn:     {borderWidth:1.5, borderColor:T.gold, borderRadius:24, paddingHorizontal:32, paddingVertical:12, alignItems:'center'},
  goldBtnText: {color:T.gold, fontSize:15, fontWeight:'800', letterSpacing:0.5},
  chipBtn:     {borderWidth:1, borderColor:T.border, borderRadius:20, paddingHorizontal:16, paddingVertical:8},
  chipText:    {color:T.textDim, fontSize:13},
  card:        {backgroundColor:T.bgCard, borderRadius:16, padding:16, borderWidth:1, borderColor:T.border, marginBottom:4},
  section:     {paddingHorizontal:20, marginTop:20},
  sectionTitle:{color:T.gold, fontSize:15, fontWeight:'800', marginBottom:12},
  zodiacCard:  {margin:20, backgroundColor:T.bgCard, borderRadius:20, padding:24, alignItems:'center', borderWidth:1.5},
  zodiacBig:   {fontSize:64, textAlign:'center'},
  zodiacChip:  {backgroundColor:T.bgCard, borderRadius:12, padding:10, alignItems:'center', borderWidth:1, width:(SW-60)/4},
  quickBtn:    {backgroundColor:T.bgCard, borderRadius:16, padding:14, alignItems:'center', borderWidth:1, borderColor:T.border, width:(SW-64)/3},
  previewCard: {backgroundColor:T.bgCard, borderRadius:16, padding:20, alignItems:'center', borderWidth:1, borderColor:T.border, marginTop:16, width:'90%'},
  avatarCircle:{width:44, height:44, borderRadius:22, backgroundColor:T.bgCard, borderWidth:1.5, borderColor:T.gold, alignItems:'center', justifyContent:'center'},
  bottomNav:   {position:'absolute', bottom:0, left:0, right:0, flexDirection:'row', backgroundColor:T.bgCard, borderTopWidth:1, borderTopColor:T.border, paddingBottom:Platform.OS==='ios'?20:8, paddingTop:8},
  navItem:     {flex:1, alignItems:'center', justifyContent:'center', gap:2},
});
