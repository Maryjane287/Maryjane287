// Concepts: who they are to you, and what they are like. Two taps in the maker
// change the pages we write, so a Mum who looks after everyone and a best
// friend who is the life of the party get different magazines, not one template.
// Imports nothing, so covers.js, heart.js and the maker can all use it.

export const PEOPLE = {
  partner: {
    label: 'My partner',
    little: ['You warm up your side of the bed, then swap.', 'You always leave me the last bite and say you are full.', 'You check I got home safe, even from the shops.', 'You hold my hand in the car without even thinking about it.', 'You know how I take my tea better than I do.', 'You laugh at my jokes the third time too.'],
    world: ['Ordinary days that feel like holidays.', 'The best person to sit in comfy silence with.', 'A laugh worth being silly for.', 'Someone who makes home feel like home.', 'Hugs that fix what words cannot.', 'A future worth looking forward to.'],
    promises: ['To keep choosing you, every single day.', 'To make the tea, even when it is your turn.', 'To plan our next adventure, and actually book it.', 'To hold your hand in the queue, the car and the hard bits.', 'To love you a little more every year.'],
    picks: ['Your laugh', 'The way you look at me', 'How safe you make me feel', 'Our silly inside jokes', 'Your hugs', 'How you believe in me', 'Your cooking', 'The way you say my name', 'Lazy Sunday mornings with you', 'How kind you are', 'Your terrible singing', 'How you always make me tea', 'The way you dance in the kitchen', 'How you make me brave'],
  },
  mum: {
    label: 'My mum',
    little: ['You still say "text me when you are home", and you mean it.', 'You ate the burnt toast so we did not have to.', 'You always have a tissue, a plaster and a snack. Always.', 'You answer every call with "what is wrong?" then "oh, hello love".', 'You remember every friend\'s name and every birthday.', 'You pretend you are not crying at the end of films.'],
    world: ['A mum who makes everyone feel looked after.', 'The best hugs ever invented.', 'Advice that turns out right, every time.', 'A kitchen that always smells like home.', 'Someone to call first with good news.', 'Love that never once asked for anything back.'],
    promises: ['To call more, and not just when I need something.', 'To finally learn your recipe properly.', 'To take you out for the day, my treat.', 'To listen when you say "take a coat".', 'To make you as proud as you make me.'],
    picks: ['Your hugs', 'Your cooking', 'How you always know when something is wrong', 'Your advice', 'How you make every house a home', 'Your laugh', 'How strong you are', 'How you never miss a birthday', 'Your patience', 'The way you say my name', 'Your terrible jokes', 'How you believe in me'],
  },
  newmum: {
    label: 'A brand new mum', hidden: true,
    little: ['You sing to me at 3am, even when you are tired.', 'You know which cry means hungry and which means cuddle.', 'You smell my head when you think nobody is looking.', 'You check on me while I sleep. Every single time.', 'You do everything one handed now, and you are brilliant at it.', 'You smile at me like I am the best thing in the world.'],
    world: ['A brand new mum, doing beautifully.', 'Lullabies, even the made up ones.', 'The softest, safest arms in the world.', 'Patience at 3am that nobody else saw.', 'A heart that grew twice as big overnight.', 'A tiny person who thinks you are everything.'],
    promises: ['To sleep through the night. One day. Probably.', 'To give you the biggest gummy smiles.', 'To hold your finger extra tight.', 'To keep you laughing, and a little bit tired.', 'To love you forever, starting now.'],
    day: [['3:00', 'The night feed', 'Sings the same lullaby for the ninth time. Means it every time.'], ['7:00', 'Good morning', 'A gummy smile, and suddenly the whole night was worth it.'], ['11:00', 'Out for a walk', 'Pram, bag, snacks, spare clothes, spare spare clothes.'], ['16:00', 'Cuddle o\'clock', 'Tea goes cold. Nobody minds.']],
    night: ['20:00', 'Bedtime', 'Checks the monitor. Then checks it again. Then once more.'],
    guide: [['home', 'Habitat', 'The sofa, with a sleeping baby on her chest'], ['apple', 'Diet', 'Cold tea and toast eaten one handed'], ['music', 'Call', 'A made up lullaby, every single night'], ['spark', 'Special ability', 'Hearing the tiniest sound from two rooms away'], ['clock', 'Most active', 'At 3am, which is the new 9am'], ['heart', 'Care instructions', 'Bring her a hot drink and hold the baby while she drinks it']],
    picks: ['Your voice', 'Your cuddles', 'Your lullabies', 'How you smell', 'Your smile', 'Bath time with you', 'How you rock me to sleep', 'Your warm hands', 'How you talk to me', 'Feeding time snuggles', 'Your silly faces', 'Simply being my mum'],
  },
  dad: {
    label: 'My dad',
    little: ['You still check my tyres every time I visit.', 'You pretend you are not proud, then tell everyone.', 'You always know a shortcut. It is never shorter.', 'You fix things before anyone notices they were broken.', 'You leave the last piece for us and say you have had enough.', 'You end every call with "right then", and it still makes me smile.'],
    world: ['A dad joke for every occasion.', 'Someone who can fix nearly anything.', 'Lifts to everywhere, at any hour.', 'Quiet pride that says more than words.', 'The safest pair of hands.', 'A laugh that fills the whole house.'],
    promises: ['To laugh at the jokes, even the one about the cheese.', 'To call just to chat, not only when the car breaks.', 'To let you drive. Sometimes.', 'To spend more Sundays together.', 'To be the kind of person you taught me to be.'],
    picks: ['Your dad jokes', 'How you can fix anything', 'Your advice', 'How you always pick up the phone', 'Your bear hugs', 'How hard you work', 'Your terrible dancing', 'How calm you stay', 'How proud you are of us', 'Car journeys with you', 'Your laugh', 'How you taught me to be brave'],
  },
  bestie: {
    label: 'My best friend',
    little: ['You answer at 2am without asking why.', 'You remember the name of everyone I have ever complained about.', 'You tell me when there is something in my teeth. That is love.', 'You hype me up before every big thing.', 'You know exactly what I mean from one look across a room.', 'You never once said "I told you so". Even when you did.'],
    world: ['A friend who feels like family.', 'Someone to laugh with until it hurts.', 'The best person to do nothing with.', 'Honest advice, gently delivered.', 'Inside jokes nobody else will ever understand.', 'A hype team of one.'],
    promises: ['To always answer the phone.', 'To tell you when there is spinach in your teeth.', 'To plan the trip and actually book it.', 'To be there for the big days and the bad days.', 'To grow old and ridiculous together.'],
    picks: ['Your laugh', 'Our inside jokes', 'How you always pick up', 'Your honest advice', 'Our late night chats', 'How you hype me up', 'Our adventures', 'How you never judge', 'Your dance moves', 'How you make every plan fun', 'Your loyalty', 'How we can talk about nothing for hours'],
  },
  sibling: {
    label: 'My sister or brother',
    little: ['You stole my clothes for years. Now you lend me yours.', 'You are the only one who remembers the same things I do.', 'You annoy me more than anyone, and I would defend you to anyone.', 'You still make the whole table laugh with the same old story.', 'You send me the funny video before I have even seen it.', 'You were my first best friend, and you still are.'],
    world: ['A built in best friend.', 'Someone who remembers everything (sadly).', 'A partner in crime since day one.', 'Someone to blame for the broken vase.', 'The person who knows exactly where you come from.', 'A lifetime of in jokes.'],
    promises: ['To stop telling the story about the haircut. Mostly.', 'To always have your back at family dinners.', 'To call more and argue less.', 'To give back the jumper. One day.', 'To be your first call, always.'],
    picks: ['Our childhood memories', 'How you always have my back', 'Your terrible jokes', 'How you make family dinners fun', 'Your laugh', 'Our secret language', 'How you never let me give up', 'How you understand me', 'Your advice, even when I ignore it', 'Our road trips', 'How brave you are', 'That you are my forever friend'],
  },
  grand: {
    label: 'My grandparent',
    little: ['You always keep biscuits in the tin, just in case.', 'You remember the story behind every photo in the house.', 'You say "look how you have grown" every single time.', 'You slip a little something into our pockets when nobody is looking.', 'You make the best of everything, even the weather.', 'You love us in a way that makes us feel ten feet tall.'],
    world: ['Stories nobody else can tell.', 'The best biscuit tin in the world.', 'Cuddles that make everything better.', 'Wisdom from a lifetime of living.', 'A home that feels like a hug.', 'A whole family that began with you.'],
    promises: ['To visit more, and stay longer.', 'To ask about the old days, and really listen.', 'To learn your famous recipe.', 'To bring the little ones round as often as we can.', 'To pass your stories on.'],
    day: [['7:00', 'Up with the birds', 'Kettle on, radio on, a look at the garden to see what has grown.'], ['10:00', 'Morning rounds', 'Calls everyone in the family. Somehow knows all the news by eleven.'], ['13:00', 'Lunch', 'Made enough for six, just in case anyone pops round.'], ['16:00', 'The grandchildren arrive', 'The biscuit tin opens. The rules relax.']],
    night: ['21:00', 'Settles down', 'Puts the photos back in order and says what a lovely day it was.'],
    picks: ['Your stories', 'Your biscuit tin', 'Your cuddles', 'Your wisdom', 'How you always have time for us', 'Your cooking', 'Your garden', 'How you make us laugh', 'How proud you are of us', 'Sunday visits', 'Your kindness', 'How your house feels like home'],
  },
  child: {
    label: 'My son or daughter',
    little: ['You still call to tell me the little things, and I love that.', 'You have become someone I would choose as a friend.', 'You remember the stories I forgot I ever told you.', 'You help without being asked now. When did that happen?', 'You make me laugh more than anyone.', 'You make me proud every single day, without even trying.'],
    world: ['A heart bigger than anyone expected.', 'A laugh that made every year better.', 'Someone who stands up for others.', 'Bad jokes, inherited and improved.', 'A person the whole family is proud of.', 'The best thing I ever did.'],
    promises: ['To always be on your side.', 'To stop telling embarrassing stories. In public.', 'To be your biggest fan, at every age.', 'To always have a bed, a meal and a hug ready.', 'To love you more than you will ever know.'],
    picks: ['Your laugh', 'How kind you are', 'Your big heart', 'How you make me proud', 'Our chats', 'Your sense of humour', 'How brave you are', 'How hard you work', 'Your hugs', 'How you look after others', 'Your style', 'Simply being you'],
  },
  teacher: {
    label: 'Our teacher', hidden: true,
    little: ['You notice the quiet ones, and help them find their voice.', 'You remember every name, every birthday and every lost tooth.', 'You make a wobbly day feel safe again.', 'You stay late so the classroom looks magic in the morning.'],
    world: ['A classroom where everyone feels they belong.', 'Lessons nobody will ever forget.', 'Patience by the bucketful.', 'Children who believe they can.', 'A smile at the door every single morning.', 'A love of learning that lasts a lifetime.'],
    promises: ['To keep reading every night.', 'To remember to be kind, like you showed us.', 'To keep asking big questions.', 'To come back and say hello.', 'To never forget what you did for us.'],
    picks: ['Your patience', 'How kind you are', 'Your fun lessons', 'How you believe in us', 'Your smile every morning', 'How you make us laugh', 'How you help when it is hard', 'Your amazing ideas', 'Story time', 'How fair you are', 'How you remember everything', 'Simply being you'],
  },
  friend: {
    label: 'A friend or workmate',
    little: ['You make the boring days fun.', 'You always notice when someone is having a hard time.', 'You bring snacks to share, and you share the good ones.', 'You laugh at everyone\'s jokes, even the bad ones.', 'You remember the little things people tell you.', 'You make everyone around you feel welcome.'],
    world: ['A friend who makes everything more fun.', 'Someone who brightens every room.', 'The best person to share a long day with.', 'Kindness, in generous portions.', 'A laugh you can hear across the building.', 'A lot of people who feel lucky to know them.'],
    promises: ['To keep the snack drawer stocked.', 'To laugh at your jokes, especially the bad ones.', 'To celebrate you more than once a year.', 'To be there whenever you need a hand.', 'To keep making memories together.'],
    picks: ['Your laugh', 'How kind you are', 'Your jokes', 'How you make every day more fun', 'Your advice', 'How you always help', 'Your great ideas', 'How calm you stay', 'Your style', 'How you make everyone welcome', 'Your snack supply', 'Simply being you'],
  },
};

export const TYPES = {
  party: {
    label: 'The life of the party',
    day: [['7:00', 'Wakes up', 'Already humming something. Nobody knows what. Nobody asks.'], ['9:30', 'First message of the day', 'A voice note to the group chat that starts with "Okay, so..." and lasts four minutes.'], ['13:00', 'Lunch', 'Somehow chats to the whole queue. Leaves with two new friends and a recommendation.'], ['18:00', 'Plans', 'Was going to have a quiet night. Is now organising a quiet night for eleven people.']],
    night: ['23:30', 'Home at last', 'Tells the story of the day so well that the people who were there want to hear it again.'],
    habitat: 'Wherever the laughing is loudest', diet: 'Snacks from other people\'s plates', call: 'A laugh you can hear from the car park',
    special: 'Turning strangers into friends in under five minutes', active: 'Just as everyone else says it is time to go home', care: 'Feed often, laugh at the stories, never leave them off the invite',
  },
  carer: {
    label: 'The one who looks after everyone',
    day: [['6:45', 'Up before everyone', 'Checks the weather for everybody else\'s day.'], ['8:30', 'Out the door', 'With a spare charger, plasters, mints and a snack for whoever forgets theirs.'], ['12:30', 'Lunch break', 'Spent on the phone with someone who needed a chat. The sandwich waits.'], ['17:30', 'On the way home', 'Remembers the thing you mentioned once, three weeks ago, and asks how it went.']],
    night: ['22:00', 'Finally sits down', 'Says "I am fine, honestly." Is still thinking about everyone else.'],
    habitat: 'The kitchen, putting the kettle on for somebody', diet: 'Whatever is left after everyone else has eaten', call: '"Have you eaten?"',
    special: 'Knowing something is wrong before you say a word', active: 'The moment anyone needs a hand', care: 'Make them a cup of tea for once, and make them drink it sitting down',
  },
  adventurer: {
    label: 'The adventurer',
    day: [['6:00', 'Awake', 'Already looking at flights. Just looking. (Not just looking.)'], ['10:00', 'Has an idea', '"What if we just went?" Nobody is ready. They go anyway.'], ['14:00', 'Somewhere new', 'Takes a wrong turn on purpose. Finds the best café in town.'], ['19:00', 'Dinner', 'Orders the one thing on the menu nobody can pronounce. Loves it.']],
    night: ['23:00', 'Back home', 'Muddy shoes, a full camera roll, and already planning the next one.'],
    habitat: 'Anywhere they have not been yet', diet: 'Street food, eaten standing up, with a view', call: '"Come on, it will be fun!"',
    special: 'Packing for a week in one small bag', active: 'The second someone says it cannot be done', care: 'Keep a bag packed and say yes more often',
  },
  calm: {
    label: 'The calm, wise one',
    day: [['7:30', 'Morning', 'Makes a proper breakfast and sits down to eat it. A rare and noble creature.'], ['10:00', 'A crisis arrives', 'Not theirs. They sort it out in one sentence.'], ['13:00', 'Lunch', 'Listens properly, then asks the one question that makes everything make sense.'], ['18:00', 'Evening', 'Every phone call answered with "Okay. Tell me everything."']],
    night: ['22:30', 'Bedtime', 'Sleeps soundly. Somehow everyone else sleeps better too.'],
    habitat: 'The comfiest chair, with a cup of something warm', diet: 'A proper cup of tea, never rushed', call: '"It will be alright, you will see." (It always is.)',
    special: 'Making a bad day feel smaller', active: 'When everyone else is panicking', care: 'Ask their advice, then actually take it',
  },
  creative: {
    label: 'The dreamer and maker',
    day: [['8:00', 'Wakes up', 'With an idea. Writes it on a receipt. Loses the receipt.'], ['11:00', 'Mid morning', 'Has rearranged the furniture. It looks amazing. Nobody can find the remote.'], ['15:00', 'Afternoon', 'Stops to look at the light on the wall, and makes you look too. They were right.'], ['19:00', 'Evening', 'Starts a brand new project. The last three wait lovingly in a drawer.']],
    night: ['00:30', 'Still awake', '"I just had the best idea." They did.'],
    habitat: 'Somewhere with good light and a playlist on', diet: 'Toast, eaten cold, because they got distracted', call: '"Ooh, look at that!"',
    special: 'Making something beautiful out of almost nothing', active: 'Around midnight, mid idea', care: 'Give them a notebook, a free afternoon and your full attention when they say "what if"',
  },
  gogetter: {
    label: 'The go getter',
    day: [['5:45', 'Alarm', 'Up before it goes off. Has never pressed snooze. Possibly a superhero.'], ['8:00', 'Work', 'Three things done before most people find their keys.'], ['12:00', 'Lunch', 'Eaten at the desk while fixing something for somebody else.'], ['18:30', 'After hours', 'Says they will relax. Reorganises a cupboard instead.']],
    night: ['21:00', 'Night', 'Writes tomorrow\'s list. Ticks off two things on it already.'],
    habitat: 'Wherever things are getting done', diet: 'Coffee, and a snack eaten in the car', call: '"Right, here is the plan."',
    special: 'Doing in one hour what takes the rest of us a week', active: 'Every waking hour, and a few others', care: 'Make them sit down, put the phone away and let someone else make the plan',
  },
};


// The other kinds of magazine: couples, children, babies, pets, families,
// trips and memorials. Each kind has its own personalities to tap, and each
// personality writes its own day in the life, field guide and little things.
const COUPLE = {
  romantics: { label: 'The old romantics',
    day: [['7:30', 'Breakfast', 'Coffee made just the way the other one likes it, without asking.'], ['12:00', 'Midday', 'A text that just says "miss you". They saw each other four hours ago.'], ['18:00', 'Dinner', 'Candles on a Tuesday. For no reason at all.'], ['21:00', 'Evening', 'Same sofa, same blanket, feet tangled together.']],
    night: ['23:00', 'Lights out', 'One last "love you". Then another one, just in case.'],
    guide: [['home', 'Habitat', 'Anywhere they can sit close together'], ['apple', 'Diet', 'Shared desserts, two spoons'], ['music', 'Call', '"Love you." "Love you more."'], ['spark', 'Special ability', 'Saying a whole sentence with one look'], ['clock', 'Most active', 'On anniversaries, and every ordinary Tuesday'], ['heart', 'Care instructions', 'Book them a table for two and let them talk for hours']],
    little: ['You still hold hands in the supermarket.', 'You save each other the last bite.', 'You still laugh at each other\'s jokes.', 'You always check the other one got home safe.'] },
  adventurers: { label: 'The adventurous pair',
    day: [['6:30', 'Up early', 'One has found a walk. The other has packed the snacks.'], ['11:00', 'Somewhere new', 'A wrong turn, a small argument about the map, then the best view of the year.'], ['15:00', 'Afternoon', 'Trying the local thing nobody can pronounce. Both pretend to love it.'], ['20:00', 'Evening', 'Planning the next trip before this one is over.']],
    night: ['23:00', 'Bed', 'Muddy boots by the door and two happy, tired people.'],
    guide: [['home', 'Habitat', 'Halfway up a hill, arguing about the map'], ['apple', 'Diet', 'Picnics in places with amazing views'], ['music', 'Call', '"Shall we just go?"'], ['spark', 'Special ability', 'Turning any weekend into a story'], ['clock', 'Most active', 'The moment a long weekend appears'], ['heart', 'Care instructions', 'Give them a free weekend and a full tank']],
    little: ['You always pack the other one\'s favourite snack.', 'You let each other choose the music. Mostly.', 'You take the photo, then make them take one of you.', 'You always find your way home together.'] },
  homebodies: { label: 'The cosy homebodies',
    day: [['8:30', 'A slow morning', 'Pyjamas until at least eleven. This is the plan.'], ['11:00', 'Big decisions', 'Which film. Which takeaway. It takes an hour. Worth it.'], ['15:00', 'Afternoon', 'A walk to the shop counts as an adventure.'], ['19:00', 'Dinner', 'Cooked together, mostly by one of them, tasted by the other.']],
    night: ['22:00', 'Early night', 'Asleep halfway through the film. Every single time.'],
    guide: [['home', 'Habitat', 'The sofa, under one shared blanket'], ['apple', 'Diet', 'Takeaway on Fridays, toast every other day'], ['music', 'Call', '"Shall we just stay in?"'], ['spark', 'Special ability', 'Making an ordinary night the best night'], ['clock', 'Most active', 'Around the third episode'], ['heart', 'Care instructions', 'Cancel their plans for them. They will thank you']],
    little: ['You make each other tea without being asked.', 'You always save the comfy side of the sofa for the other one.', 'You know each other\'s takeaway order by heart.', 'You fall asleep on each other\'s shoulder every film night.'] },
  comedians: { label: 'The double act',
    day: [['8:00', 'Morning', 'The first joke is told before the kettle boils.'], ['12:30', 'Lunch', 'A running joke from years ago makes a surprise comeback.'], ['17:00', 'Errands', 'A trip to buy light bulbs becomes a forty minute comedy show.'], ['20:00', 'Dinner with friends', 'Finishing each other\'s stories, and arguing about the ending.']],
    night: ['23:30', 'Bedtime', 'Still giggling about something nobody else would find funny.'],
    guide: [['home', 'Habitat', 'Wherever there is an audience'], ['apple', 'Diet', 'Snacks, shared, with commentary'], ['music', 'Call', 'Two laughs, one slightly louder'], ['spark', 'Special ability', 'Turning any disaster into a story everyone wants to hear'], ['clock', 'Most active', 'At family dinners, when the old stories come out'], ['heart', 'Care instructions', 'Laugh at the jokes. All of them. They have been rehearsing']],
    little: ['You laugh at each other\'s jokes, even the old ones.', 'You know exactly which story the other one is about to tell.', 'You make the hard days funny.', 'You still make each other cry laughing.'] },
  team: { label: 'The dream team',
    day: [['6:45', 'Morning', 'Two coffees, one plan, everything already sorted.'], ['9:00', 'The rush', 'One finds the keys, the other finds the shoes. Nobody is late.'], ['14:00', 'A problem', 'Solved in one phone call. They make it look easy.'], ['18:30', 'Home', 'Dinner, washing up and tomorrow sorted, in perfect rhythm.']],
    night: ['22:00', 'Finally', 'Feet up, side by side. Another day, smashed together.'],
    guide: [['home', 'Habitat', 'Wherever things need sorting out'], ['apple', 'Diet', 'Whatever is quick, eaten together'], ['music', 'Call', '"Leave it with us."'], ['spark', 'Special ability', 'Getting through anything, as long as it is together'], ['clock', 'Most active', 'When life gets busy, which is always'], ['heart', 'Care instructions', 'Make them take a day off together, with nothing planned']],
    little: ['You always have each other\'s back.', 'You do the jobs the other one hates.', 'You notice when the other one is tired.', 'You make every hard thing feel lighter.'] },
};

const KID = {
  giggler: { label: 'The giggler',
    day: [['7:00', 'Wakes up', 'Already laughing. At what? Nobody knows.'], ['8:00', 'Breakfast', 'Makes a face out of the cereal. Laughs so hard the milk comes out.'], ['13:00', 'Lunch', 'Tells the same joke six times. It gets funnier every time.'], ['17:30', 'Bath time', 'Bubbles everywhere, mostly on the floor. Giggles echo round the house.']],
    night: ['19:30', 'Bedtime', 'One more joke. Then one more. Falls asleep smiling.'],
    guide: [['home', 'Habitat', 'Wherever the tickles are'], ['apple', 'Diet', 'Anything shaped like a smiley face', 'food'], ['music', 'Call', 'A giggle you can hear from the garden'], ['spark', 'Special ability', 'Making grown ups laugh on the worst days', 'expert'], ['clock', 'Most active', 'Exactly when it is time to be quiet'], ['heart', 'Care instructions', 'Tickle daily. Laugh at every joke, especially the ones that make no sense']],
    little: ['You laugh with your whole body.', 'You tell jokes that make no sense, and they are still the best.', 'You make everyone smile, even the grumpy ones.', 'You laugh in your sleep sometimes. We noticed.'] },
  explorer: { label: 'The little explorer',
    day: [['7:00', 'Up and out', 'Wellies on. Pyjamas still on. Ready for adventure.'], ['10:00', 'Garden expedition', 'Finds a worm, a stick and a very important stone.'], ['13:00', 'Lunch', 'Eaten quickly. There is a puddle that needs checking.'], ['16:00', 'Discovery', 'Asks "why?" forty times. Every question a good one.']],
    night: ['19:00', 'Bedtime', 'Pockets emptied: two conkers, a feather and half a biscuit.'],
    guide: [['home', 'Habitat', 'The muddiest corner of the garden'], ['apple', 'Diet', 'Snacks eaten on the move', 'food'], ['music', 'Call', '"Look what I found!"'], ['spark', 'Special ability', 'Finding treasure where nobody else looks', 'expert'], ['clock', 'Most active', 'Whenever there is a puddle'], ['heart', 'Care instructions', 'Wash the knees, keep the treasures, never stop answering why']],
    little: ['You notice tiny things grown ups walk straight past.', 'You keep the best stones in your pocket.', 'You ask the questions we never thought to ask.', 'You always come home with something to show us.'] },
  builder: { label: 'The builder and maker',
    day: [['7:30', 'Morning', 'Building before breakfast. A tower, a rocket, a house for the cat.'], ['10:00', 'Big project', 'Every cushion in the house is now a castle.'], ['13:00', 'Lunch', 'The sandwich became a boat. It sank.'], ['16:00', 'Afternoon', 'Draws a picture so good it goes straight on the fridge.']],
    night: ['19:00', 'Bedtime', 'Asks to keep the castle up until tomorrow. The answer is yes.'],
    guide: [['home', 'Habitat', 'Surrounded by bricks, glue and cardboard boxes'], ['apple', 'Diet', 'Crusts off, shapes preferred', 'food'], ['music', 'Call', '"Come and see what I made!"'], ['spark', 'Special ability', 'Turning a cardboard box into anything at all', 'expert'], ['clock', 'Most active', 'The moment a box arrives in the post'], ['heart', 'Care instructions', 'Never throw away the boxes. Admire every creation']],
    little: ['You make presents for us out of nothing at all.', 'You are so proud when you finish something, and so are we.', 'You concentrate so hard your tongue pokes out.', 'You try to fix your toys before you ask for help.'] },
  chatterbox: { label: 'The chatterbox',
    day: [['7:00', 'Wakes up', 'Talking. Mid sentence. Possibly talked all night.'], ['8:30', 'School run', 'A full report on dreams, dinosaurs and best friends.'], ['13:00', 'Lunch', 'Questions between every bite. Lunch takes an hour.'], ['17:00', 'After school', 'Tells us everything. Then tells us again, with sound effects.']],
    night: ['19:30', 'Bedtime', '"One more question." It is never one.'],
    guide: [['home', 'Habitat', 'Right next to whoever is listening'], ['apple', 'Diet', 'Words, mostly, with snacks in between', 'food'], ['music', 'Call', '"Guess what? Guess what? Guess what?"'], ['spark', 'Special ability', 'Remembering every word anyone ever said', 'expert'], ['clock', 'Most active', 'From the first minute awake to the last'], ['heart', 'Care instructions', 'Listen properly. They have the best stories']],
    little: ['You tell us about your day in so much detail we feel like we were there.', 'You remember things we said months ago.', 'You ask how our day was, and you really want to know.', 'You talk in your sleep. It is adorable.'] },
  performer: { label: 'The little performer',
    day: [['7:00', 'Morning', 'Sings to the cereal. An encore nobody asked for, given anyway.'], ['10:00', 'Show time', 'The living room is a stage. Tickets cost one hug.'], ['13:00', 'Lunch', 'Dances between bites.'], ['17:00', 'Rehearsal', 'Wears a costume made of every scarf in the house.']],
    night: ['19:30', 'Bedtime', 'A final bow, then a bedtime song performed for the teddies.'],
    guide: [['home', 'Habitat', 'Centre stage, usually the sofa'], ['apple', 'Diet', 'Anything, as long as there is music', 'food'], ['music', 'Call', '"Watch me! Watch me!"'], ['spark', 'Special ability', 'Turning any room into a show', 'expert'], ['clock', 'Most active', 'When visitors arrive'], ['heart', 'Care instructions', 'Clap loudly. Always ask for an encore']],
    little: ['You dance in the supermarket like nobody is watching.', 'You sing to make sad people happy.', 'You give the best bows in the world.', 'You make every ordinary day a show.'] },
};

const BABY = {
  baby: { label: 'Our little one',
    day: [['6:00', 'Wakes up', 'Announces it to the whole street.'], ['9:00', 'Breakfast', 'Most of it eaten. Some of it worn.'], ['13:00', 'Nap time', 'The whole house tiptoes. Somebody drops a spoon.'], ['17:00', 'Playtime', 'Discovers their own feet. Best day ever.']],
    night: ['19:00', 'Bedtime', 'Milky cuddles, a sleepy sigh, and everybody melts.'],
    guide: [['home', 'Habitat', 'The comfiest arms in the room'], ['apple', 'Diet', 'Milk, and anything on your plate', 'food'], ['music', 'Call', 'A tiny squeak that brings everyone running'], ['spark', 'Special ability', 'Making grown adults talk in silly voices', 'skill'], ['clock', 'Most active', 'At 3am, mostly'], ['heart', 'Care instructions', 'Cuddle often, sing badly, take a thousand photos']],
    little: ['You hold our finger like you will never let go.', 'You smile in your sleep.', 'You smell like the best thing in the world.', 'You make the whole family stop and stare.'] },
};

const BUMP = {
  bump: { label: 'The bump',
    day: [['6:30', 'Morning', 'The bump wakes up first, with a kick to say hello.'], ['10:00', 'Snack o\'clock', 'A craving arrives. Nobody argues with the bump.'], ['14:00', 'Afternoon', 'Hiccups. Everyone gathers round to feel them.'], ['18:00', 'Evening', 'Someone reads a story to the bump. The bump dances.']],
    night: ['23:00', 'Bedtime', 'Finally settled, after one last somersault.'],
    guide: [['home', 'Habitat', 'Snug, cosy and very much loved'], ['apple', 'Diet', 'Whatever was craved today', 'craving'], ['music', 'Call', 'A kick, right on time'], ['spark', 'Special ability', 'Getting everyone excited before even arriving'], ['clock', 'Most active', 'The moment anyone tries to sleep'], ['heart', 'Care instructions', 'Talk to it, sing to it, and get ready for the best adventure']],
    little: ['You talk to the bump when you think nobody is listening.', 'You have already chosen the first bedtime story.', 'You light up every time it kicks.', 'You are going to be wonderful at this.'] },
};

const PET = {
  menace: { label: 'The little menace',
    day: [['6:00', 'Wake up call', 'Sits on a face. Very effective.'], ['9:00', 'Morning', 'Steals one sock. Hides it. Forgets where.'], ['13:00', 'Afternoon', 'Knocks one thing off the table, keeping eye contact.'], ['17:00', 'Zoomies', 'Laps of the house at top speed for no reason at all.']],
    night: ['22:00', 'Night', 'Curls up looking completely innocent. Nobody is fooled.'],
    guide: [['home', 'Habitat', 'Wherever the mess is'], ['apple', 'Diet', 'Anything left within reach', 'snack'], ['music', 'Call', 'A crash, followed by silence'], ['spark', 'Special ability', 'Looking innocent at the scene of the crime', 'talent'], ['clock', 'Most active', 'Just after you tidy up'], ['heart', 'Care instructions', 'Hide the socks. Forgive everything']],
    little: ['You pretend you did not do it. We know you did.', 'You always know when someone needs cheering up.', 'You bring us presents, even the ones we did not want.', 'You make every day more chaotic, and much better.'] },
  diva: { label: 'The diva',
    day: [['7:30', 'Wakes up', 'Stretches, inspects the household, finds it acceptable.'], ['10:00', 'Grooming', 'An hour on the hair. Worth it.'], ['14:00', 'Afternoon', 'Sits in the sunniest spot. Moves when the sun moves.'], ['18:00', 'Dinner', 'Refuses the food. Eats the food when nobody is looking.']],
    night: ['22:00', 'Bedtime', 'Takes the best pillow. It was always theirs.'],
    guide: [['home', 'Habitat', 'The best seat in the house'], ['apple', 'Diet', 'Only the finest, served promptly', 'snack'], ['music', 'Call', 'A look that says "excuse me?"'], ['spark', 'Special ability', 'Getting exactly what they want, every time', 'talent'], ['clock', 'Most active', 'When dinner is three minutes late'], ['heart', 'Care instructions', 'Respect the schedule. Compliment often']],
    little: ['You act like you do not care, then fall asleep on our feet.', 'You choose who to love, and you chose us.', 'You have better hair than anyone in the house.', 'You make "please" look like an order.'] },
  foodie: { label: 'The foodie',
    day: [['6:00', 'Breakfast alarm', 'Starts reminding everyone about breakfast at dawn.'], ['9:00', 'Second breakfast', 'Tries to convince someone new they have not been fed.'], ['13:00', 'Lunch watch', 'Sits very politely by the table. Eyes enormous.'], ['17:00', 'Dinner time', 'Hears the food cupboard open from three rooms away.']],
    night: ['21:00', 'Night', 'A final snack check, then a happy, full sleep.'],
    guide: [['home', 'Habitat', 'The kitchen, very near the fridge'], ['apple', 'Diet', 'Everything. Especially yours', 'snack'], ['music', 'Call', 'The rustle of a packet, heard from anywhere'], ['spark', 'Special ability', 'The saddest eyes ever seen at dinner time', 'talent'], ['clock', 'Most active', 'Mealtimes, and the hour before them'], ['heart', 'Care instructions', 'Measure the food. Ignore the eyes. (Impossible.)']],
    little: ['You sit so nicely when you want something.', 'You get excited about every dinner like it is the first.', 'You share your joy with the whole house.', 'You always remember who gave you the cheese.'] },
  shadow: { label: 'The shadow',
    day: [['7:00', 'Morning', 'Follows us to the bathroom. Every time.'], ['10:00', 'Working from home', 'Sits on the keyboard. It is helping.'], ['14:00', 'Afternoon', 'Waits by the door if anyone goes out for even one minute.'], ['18:00', 'Welcome home', 'Greets us like we have been gone for a year.']],
    night: ['22:00', 'Night', 'As close as possible. Then a little bit closer.'],
    guide: [['home', 'Habitat', 'Exactly where you are'], ['apple', 'Diet', 'Anything, as long as you are there', 'snack'], ['music', 'Call', 'A happy sigh when you sit down'], ['spark', 'Special ability', 'Knowing you are sad before you do', 'talent'], ['clock', 'Most active', 'Whenever you move'], ['heart', 'Care instructions', 'Never close a door. Cuddles on demand']],
    little: ['You wait by the window until we are home.', 'You sit with us on the hard days.', 'You make every welcome home the best part of the day.', 'You never let us feel alone.'] },
  napper: { label: 'The professional napper',
    day: [['9:00', 'Wakes up', 'Eventually.'], ['10:00', 'First nap', 'Exhausted from waking up.'], ['13:00', 'Lunch', 'Eaten, followed by a well earned nap.'], ['17:00', 'Afternoon', 'A short stretch. Back to sleep.']],
    night: ['22:00', 'Bedtime', 'Somehow still tired. Sleeps across most of the bed.'],
    guide: [['home', 'Habitat', 'The warmest, softest spot in the house'], ['apple', 'Diet', 'Light snacks between naps', 'snack'], ['music', 'Call', 'A tiny snore'], ['spark', 'Special ability', 'Falling asleep anywhere, in any position', 'talent'], ['clock', 'Most active', 'Rarely. Briefly'], ['heart', 'Care instructions', 'Provide blankets. Do not disturb']],
    little: ['You snore, and we love it.', 'You find the one patch of sunshine in the whole house.', 'You make resting look like an art.', 'You make everyone around you feel calm.'] },
};

const FAMILY = {
  lively: { label: 'Loud and lively',
    day: [['7:00', 'Morning', 'Three people talking at once. Nobody minds.'], ['9:00', 'Leaving the house', 'Takes forty minutes and four trips back for something.'], ['13:00', 'Lunch', 'Someone tells a story. Everyone corrects it.'], ['18:00', 'Dinner', 'Every seat full, every voice raised, every plate cleared.']],
    night: ['22:00', 'Bedtime', 'A last shout of "night!" from every room.'],
    guide: [['home', 'Habitat', 'Around the kitchen table, all talking at once'], ['apple', 'Diet', 'Big dishes, passed around', 'dinner'], ['music', 'Call', 'Everybody at once'], ['spark', 'Special ability', 'Turning a quiet day into a party'], ['clock', 'Most active', 'When the whole family is in one room'], ['heart', 'Care instructions', 'Turn the music up, set extra places and join in']],
    little: ['You always save a seat for whoever turns up.', 'You argue over board games and laugh about it after.', 'You make every visit feel like a party.', 'You never let anyone feel left out.'] },
  cosy: { label: 'The cosy crew',
    day: [['8:30', 'Slow morning', 'Pancakes, pyjamas, nobody in a hurry.'], ['11:00', 'Plans', 'A walk, maybe. A film, definitely.'], ['15:00', 'Afternoon', 'Blankets, biscuits and someone asleep on the sofa.'], ['19:00', 'Dinner', 'Something warm, eaten together.']],
    night: ['21:30', 'Night', 'Family film, everybody squeezed onto one sofa.'],
    guide: [['home', 'Habitat', 'Under the biggest blanket in the house'], ['apple', 'Diet', 'Hot chocolate and something baked', 'dinner'], ['music', 'Call', '"Shall we put a film on?"'], ['spark', 'Special ability', 'Making any house feel like home'], ['clock', 'Most active', 'Sunday afternoons'], ['heart', 'Care instructions', 'Bring snacks, take your shoes off, stay a while']],
    little: ['You always make room on the sofa.', 'You remember who likes which mug.', 'You make rainy days the best days.', 'You make everyone feel at home.'] },
  sporty: { label: 'Always on the go',
    day: [['6:30', 'Up early', 'Trainers on, water bottles filled, everyone out of the door.'], ['10:00', 'Match day', 'The loudest supporters on the touchline, every week.'], ['13:00', 'Lunch', 'Eaten in the car on the way to the next thing.'], ['17:00', 'Afternoon', 'A bike ride, a kickabout, a race to the park.']],
    night: ['21:00', 'Night', 'Muddy kit in the wash and everyone asleep in minutes.'],
    guide: [['home', 'Habitat', 'Somewhere outdoors, slightly muddy'], ['apple', 'Diet', 'Orange slices and big pasta dinners', 'dinner'], ['music', 'Call', '"Come on, one more go!"'], ['spark', 'Special ability', 'Turning anything into a competition'], ['clock', 'Most active', 'All day, every day'], ['heart', 'Care instructions', 'Wash the kit. Cheer the loudest']],
    little: ['You cheer for each other like it is the cup final.', 'You never let anyone give up.', 'You turn every walk into a race.', 'You show up for each other, every single time.'] },
  foodies: { label: 'The foodies',
    day: [['8:00', 'Breakfast', 'A big debate about pancakes or eggs. Both are made.'], ['12:00', 'Lunch', 'Planning dinner while eating lunch.'], ['15:00', 'Afternoon', 'Somebody is baking. The whole house smells amazing.'], ['19:00', 'Dinner', 'The famous family recipe, cooked with love and a lot of opinions.']],
    night: ['21:30', 'Night', 'Leftovers already claimed for tomorrow.'],
    guide: [['home', 'Habitat', 'The kitchen, all of them at once'], ['apple', 'Diet', 'Everything, made from scratch, with seconds', 'dinner'], ['music', 'Call', '"Is anyone hungry?"'], ['spark', 'Special ability', 'Turning any meal into a celebration'], ['clock', 'Most active', 'Mealtimes, and the planning before them'], ['heart', 'Care instructions', 'Arrive hungry. Always ask for the recipe']],
    little: ['You always cook too much, just in case.', 'You save the best bit for someone else.', 'You teach the family recipes to the little ones.', 'You turn every meal into a memory.'] },
};

const TRIP = {
  trip: { label: 'Our trip',
    day: [['8:00', 'Morning', 'Breakfast somewhere new, with a view worth the early alarm.'], ['11:00', 'Exploring', 'No plan, comfy shoes, and every street a surprise.'], ['14:00', 'Lunch', 'The best meal of the trip, found completely by accident.', 'meal'], ['18:00', 'Golden hour', 'Too many photos of the same sunset. No regrets.', 'view']],
    night: ['23:00', 'Back at base', 'Tired feet, full hearts, already planning to come back.'],
    guide: [['home', 'Habitat', 'Window seats and tiny cafés'], ['apple', 'Diet', 'Whatever the locals are eating', 'meal'], ['music', 'Call', '"Just one more photo!"'], ['spark', 'Special ability', 'Getting lost and finding something better'], ['clock', 'Most active', 'From sunrise until the last ice cream'], ['heart', 'Care instructions', 'Pack light, say yes, keep the tickets for the scrapbook']],
    little: ['Always saving the window seat for someone else.', 'Sharing every snack, even the good ones.', 'Holding hands on the busy streets.', 'Laughing through every wrong turn.'] },
};

const GENTLE = {
  person: { label: 'Remembering them',
    day: [['Morning', 'The start of the day', 'The kettle on, the radio low, a kind word for whoever came in first.'], ['Midday', 'Always time for a chat', 'And always a story to go with it.'], ['Afternoon', 'Doing what they loved', 'Busy, and happy, with the things that were so them.', 'loved'], ['Evening', 'Everyone close', 'Their laugh filling the room.']],
    night: ['Today', 'Still here', 'We feel them in every quiet, ordinary moment.'],
    guide: [['home', 'Their place', 'The spot that will always feel like theirs'], ['heart', 'Their way', 'Doing things properly, and kindly'], ['music', 'Their words', 'Words we still hear in our heads', 'saying'], ['spark', 'Their gift', 'Making everyone feel welcome'], ['clock', 'Their time', 'Always, for anyone who needed it'], ['star', 'Their love', 'Steady, warm and everywhere']],
    little: ['The way you always waved goodbye at the door.', 'The cup of tea that was always waiting.', 'The way you remembered everyone\'s birthday.', 'The way you made us all feel loved.'] },
  pet: { label: 'Remembering them',
    day: [['Morning', 'Hello', 'A happy hello at the bedroom door.'], ['Midday', 'Sunshine', 'Following the sunshine round the house.', 'spot'], ['Afternoon', 'Out and about', 'A walk, a sniff of everything, a happy, tired walk home.'], ['Evening', 'Close', 'Curled up close, exactly where they belonged.']],
    night: ['Today', 'Always', 'Their spot is empty, but our hearts are full of them.'],
    guide: [['home', 'Favourite place', 'The sunny patch by the window', 'spot'], ['heart', 'Sweetest habit', 'Waiting at the door for us', 'habit'], ['music', 'A sound we miss', 'The happy sigh at the end of the day'], ['spark', 'Their gift', 'Making every day better'], ['clock', 'Always ready for', 'A cuddle, a walk, a treat'], ['star', 'Their love', 'Loyal, gentle and completely ours']],
    little: ['How you always knew when we were sad.', 'How you waited at the window for us.', 'How you made every homecoming the best moment.', 'How you loved us, simply and completely.'] },
};

// What each kind of magazine calls its pages, and the captions on the little notes.
export const PACKS = {
  person: { types: TYPES, people: PEOPLE },
  couple: { types: COUPLE, ask: 'Which sounds most like the two of them?' },
  kid: { types: KID, ask: 'Which sounds most like them?' },
  baby: { types: BABY },
  bump: { types: BUMP, day: '24 Hours with the Bump', guide: 'A Field Guide to the Bump', letters: 'Things We Have Already Noticed' },
  pet: { types: PET, ask: 'Which sounds most like them?', letters: 'Little Things We Pretend Not to Notice', noted: ['Caught on camera', 'Seen, and forgiven', 'Noted with love', 'Every single time'] },
  family: { types: FAMILY, day: '24 Hours with {who}', guide: 'A Field Guide to {who}', ask: 'Which sounds most like your family?', letters: 'The Little Things That Make Us, Us', noted: ['Every time', 'Always', 'Our favourite', 'Forever'] },
  trip: { types: TRIP, day: 'Our Perfect Day in {place}', guide: 'Travelling With Us: a Field Guide', letters: 'The Little Things We Will Never Forget', noted: ['Every day', 'Always', 'Never forgotten', 'Next time too'] },
  gentle: { types: { person: GENTLE.person }, gentle: true },
  gentlePet: { types: { person: GENTLE.pet }, gentle: true },
};

const NOTED = ['Noticed every time', 'Never forgotten', 'Seen, and loved', 'Thank you'];
const GENTLE_NOTED = ['Always', 'Remembered', 'Held close', 'Forever'];

// Which pack a magazine uses, its fixed person if any, and the buyer's picks.
export const packOf = H => (H?.concepts ? PACKS[H.concepts === true ? 'person' : H.concepts] : null);
export function conceptOf(v, H = { concepts: true }) {
  const P = packOf(H) || PACKS.person;
  const types = Object.keys(P.types);
  const who = P.people ? (H.conceptWho || (PEOPLE[v.x_who] && !PEOPLE[v.x_who].hidden ? v.x_who : 'friend')) : '';
  return { who, type: P.types[v.x_type] ? v.x_type : types[0] };
}

// Returns a copy of a magazine's written pages (data/heart/<slug>.json) with
// the generic pages swapped for ones about this person: a day in their life,
// the little things only you notice, and a field guide to them.
// Text is returned with {tokens} for heart.js to fill and escape.
export function applyConcept(H, v) {
  const pack = packOf(H);
  if (!pack) return H;
  const { who, type } = conceptOf(v, H);
  const T = pack.types[type];
  const brace = s => String(s || '').trim().replace(/[{}]/g, '');
  const ans = (ids, fallback) => { for (const id of [].concat(ids || [])) { const x = brace(v[id]); if (x) return x; } return fallback; };
  const out = { ...H };
  const gentle = !!pack.gentle;
  // A person's own answers beat our words wherever they fit.
  const P = who ? PEOPLE[who] : null;
  const guide = P?.guide || T.guide || [['home', 'Habitat', T.habitat], ['apple', 'Diet', T.diet, ['obsession', 'fuel', 'coffee', 'dish', 'food']], ['music', 'Call', T.call, ['says']], ['spark', 'Special ability', T.special, ['talent', 'power', 'skill', 'weapon', 'best']], ['clock', 'Most active', T.active], ['heart', 'Care instructions', T.care]];
  const day = (P?.day || T.day).map(([a, b, c, f]) => [a, b, f && brace(v[f]) ? brace(v[f]) : c]);
  out.timeline = { kicker: gentle ? 'As we remember it' : 'A day in the life', title: pack.day || (gentle ? 'A Day with {first}, Remembered' : '24 Hours with {first}'), items: day, today: P?.night || T.night, roomy: true };
  out.facts = { kicker: gentle ? 'Always them' : 'A field guide', title: pack.guide || (gentle ? 'The Things That Were So {first}' : 'A Field Guide to {first}'), items: guide.map(([i, h, x, f]) => [i, h, f ? ans(f, x) : x]), hand: gentle ? 'Nobody else was ever quite like {first}.' : 'Rare, precious and impossible to replace. Handle with love.', roomy: true };
  const little = (P ? P.little : T.little).slice(0, 4);
  const noted = gentle ? GENTLE_NOTED : pack.noted || NOTED;
  out.letters = { kicker: 'The little things', title: pack.letters || (gentle ? 'The Little Things We Will Always Remember' : 'The Things You Think Nobody Notices'), items: little.map((x, i) => [x, noted[i]]), hand: gentle ? 'Every one of them, kept safe in our hearts.' : P ? '{from} noticed every single one, {who}.' : 'We noticed every single one.' };
  if (P) {
    out.world = { ...H.world, items: [...P.world, 'And the one and only {who}.'] };
    if (!H.promises?.own) out.promises = { ...H.promises, items: P.promises };
    out.picks = { ...H.picks, items: P.picks };
  }
  return out;
}
