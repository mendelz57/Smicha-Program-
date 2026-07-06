import { db } from '../lib/db';
import { questions, questionOptions } from '../lib/schema';

const allQuestions: { videoId: number; qs: { question: string; options: string[]; correctIndex: number }[] }[] = [
  {
    videoId: 1,
    qs: [
      { question: "What is the Torah source for the prohibition of Basar Bechalav?", options: ["Lo tivashel gedi b'chalev imo", "Lo tochal kol nevelah", "Lo ta'aseh melachah", "V'lo tachmod"], correctIndex: 0 },
      { question: "How many times is the prohibition of cooking meat in milk mentioned in the Torah?", options: ["Once", "Twice", "Three times", "Four times"], correctIndex: 2 },
      { question: "What does 'gedi' literally mean in the Torah's prohibition?", options: ["Any kosher animal", "A young goat/kid", "A calf", "A lamb"], correctIndex: 1 },
      { question: "From where do the Rabbis derive the prohibition against eating meat and milk together?", options: ["From the repetition of the verse three times", "From a separate pasuk", "From a tradition of Moshe", "From Devarim only"], correctIndex: 0 },
      { question: "Which of the following is a Biblical prohibition according to most Rishonim?", options: ["Eating chicken with milk", "Eating beef with milk", "Deriving benefit from chicken and milk", "Waiting between chicken and milk"], correctIndex: 1 },
      { question: "What is the status of eating chicken with milk?", options: ["Biblical prohibition", "Rabbinic prohibition", "Permitted", "Permitted only for Sephardim"], correctIndex: 1 },
      { question: "Which Tanna held that chicken with milk is biblically prohibited?", options: ["Rabbi Akiva", "Rabbi Yosi HaGelili", "Rabbi Yehuda", "Rabbi Meir"], correctIndex: 1 },
      { question: "What is the halacha if one accidentally cooked chicken in milk?", options: ["The mixture is permitted", "The mixture is rabbinically forbidden", "The mixture is biblically forbidden", "It depends on the amount"], correctIndex: 1 },
      { question: "Fish with milk — what is the halacha?", options: ["Biblically forbidden", "Rabbinically forbidden", "Permitted but some are stringent", "Forbidden only if cooked together"], correctIndex: 2 },
      { question: "What is the prohibition of 'bishul' in Basar Bechalav?", options: ["Eating cooked meat and milk", "Cooking meat and milk together", "Selling meat and milk together", "Owning meat and milk together"], correctIndex: 1 },
      { question: "Which of the three prohibitions (cooking, eating, benefit) applies to chicken and milk?", options: ["All three", "Eating and benefit only", "Cooking only", "Eating only"], correctIndex: 3 },
      { question: "What is the minimum shiur (amount) for the Biblical prohibition of eating Basar Bechalav?", options: ["A kezayis", "A k'beitzah", "Any amount", "A reviis"], correctIndex: 0 },
      { question: "Who is the author of the Shulchan Aruch?", options: ["Rambam", "Rabbi Yosef Karo", "Rabbi Moshe Isserles", "Rabbi Yakov ben Asher"], correctIndex: 1 },
      { question: "What section of Shulchan Aruch deals with Basar Bechalav?", options: ["Orach Chaim", "Yoreh Deah", "Even HaEzer", "Choshen Mishpat"], correctIndex: 1 },
      { question: "What does 'hana'ah' mean in the context of Basar Bechalav?", options: ["Eating", "Cooking", "Deriving benefit", "Selling"], correctIndex: 2 },
    ],
  },
  {
    videoId: 2,
    qs: [
      { question: "According to Siman 87 seif 4, what is the status of the stomach of a kosher animal that was cooked with milk?", options: ["Permitted", "Forbidden biblically", "Forbidden rabbinically", "Depends on the amount of milk"], correctIndex: 1 },
      { question: "What is the halacha regarding hard cheese that was cooked with meat?", options: ["Permitted", "Forbidden rabbinically", "Forbidden biblically", "Permitted b'dieved"], correctIndex: 2 },
      { question: "What does 'gevinas akum' refer to?", options: ["Cheese made by non-Jews", "Milk from a non-kosher animal", "Cheese made on Shabbos", "Imported cheese"], correctIndex: 0 },
      { question: "Is there a Biblical prohibition to derive benefit from a mixture of meat and milk?", options: ["Yes, always", "Only if cooked together", "No, benefit is only rabbinically forbidden", "Only for beef, not chicken"], correctIndex: 1 },
      { question: "What is the ruling regarding bones, sinews, and skin in relation to Basar Bechalav?", options: ["They are fully prohibited like meat", "They are permitted", "They are rabbinically prohibited", "Only bones are prohibited"], correctIndex: 2 },
      { question: "According to Siman 87, what is the status of marrow cooked with milk?", options: ["Permitted", "Forbidden biblically if from a Biblical meat source", "Forbidden rabbinically", "No issue"], correctIndex: 1 },
      { question: "What is 'egozei perech' in the context of dairy prohibition?", options: ["Nuts that resemble cheese", "A type of rennet", "Walnuts soaked in milk", "A trade name for soft cheese"], correctIndex: 1 },
      { question: "According to seif 5, what is the law regarding cheese that has a worm inside?", options: ["The cheese is forbidden", "Only the worm is forbidden", "The cheese requires checking", "It is permitted"], correctIndex: 0 },
      { question: "What is the halacha if meat fell into milk and was immediately removed?", options: ["Always forbidden", "Permitted if less than 1/60", "Always permitted", "Depends on whether it was cooked"], correctIndex: 3 },
      { question: "Which posek is most associated with the rulings in Yoreh Deah 87?", options: ["Rambam", "Rabbi Yosef Karo (Mechaber)", "Ramban", "Rashba"], correctIndex: 1 },
      { question: "What is the Rema's position on eating chicken with butter?", options: ["Permitted", "Forbidden", "Permitted for Sephardim only", "Only forbidden if cooked together"], correctIndex: 1 },
      { question: "What does seif 6 discuss?", options: ["The waiting period between meat and milk", "The status of broth with milk", "Selling meat and milk", "The status of a pot used for both"], correctIndex: 0 },
      { question: "How long must one wait between eating meat and dairy according to the basic halacha?", options: ["1 hour", "3 hours", "6 hours", "12 hours"], correctIndex: 2 },
      { question: "What is the source for waiting between meat and dairy?", options: ["A biblical verse", "A Mishnah in Chullin", "The Talmud Yerushalmi", "A ruling of the Rambam"], correctIndex: 1 },
      { question: "According to the Rema, what is the Ashkenazic custom regarding the waiting period?", options: ["1 hour", "3 hours", "6 hours", "No waiting required"], correctIndex: 2 },
    ],
  },
  {
    videoId: 3,
    qs: [
      { question: "What does seif 6 say about eating meat after dairy?", options: ["Must wait 6 hours", "Must wait 1 hour", "Only needs to rinse mouth and check hands", "Must wait 3 hours"], correctIndex: 2 },
      { question: "According to seif 7, what is required before eating dairy after hard cheese?", options: ["Nothing special", "Rinse mouth only", "Wait 6 hours", "Wash hands and rinse mouth"], correctIndex: 2 },
      { question: "What is considered 'hard cheese' for the purpose of waiting?", options: ["Any aged cheese", "Cheese aged more than 6 months", "Cheese that has holes", "Cheese that is difficult to cut"], correctIndex: 1 },
      { question: "What does the Shach say about waiting after eating hard cheese?", options: ["Must wait 6 hours", "No waiting needed", "Wait 1 hour", "Depends on the type of meat"], correctIndex: 0 },
      { question: "What is the halacha for a child who ate meat regarding dairy?", options: ["Same as adult", "Wait 1 hour", "No waiting required", "Depends on the child's age"], correctIndex: 1 },
      { question: "According to the poskim, does one need to wait after tasting meat without swallowing?", options: ["Yes, full wait required", "No waiting required", "Only need to rinse mouth", "Wait 1 hour"], correctIndex: 2 },
      { question: "What is the halacha if meat is stuck between one's teeth?", options: ["Must remove it before eating dairy", "Can eat dairy immediately", "Wait only 1 hour", "No special requirement"], correctIndex: 0 },
      { question: "What does 'kedei shiur achilah' mean?", options: ["The amount of time for eating", "The minimum amount that requires waiting", "A full meal's worth", "The shiur for blessings"], correctIndex: 1 },
      { question: "According to seif 6, must one wash hands between meat and dairy?", options: ["Always required", "Not required but some are stringent", "Only required for men", "Only after eating chicken"], correctIndex: 1 },
      { question: "What is the halacha of eating dairy immediately after poultry (chicken)?", options: ["Permitted after rinsing", "Must wait 6 hours", "Must wait 1 hour", "Forbidden always"], correctIndex: 0 },
      { question: "What is the Mechaber's ruling on waiting after eating poultry before dairy?", options: ["Must wait 6 hours", "Same as beef", "No waiting, only rinse", "Wait 3 hours"], correctIndex: 0 },
      { question: "According to the Rema, what does Ashkenazic custom require after eating poultry?", options: ["No wait", "Wait 1 hour", "Wait 3 hours", "Wait 6 hours"], correctIndex: 3 },
      { question: "What does 'v'chen nohagim' indicate in the Rema?", options: ["This is the forbidden practice", "This is the accepted Ashkenazic custom", "This is a doubt", "This is Sephardic custom"], correctIndex: 1 },
      { question: "What is the Taz's opinion on waiting after poultry?", options: ["No wait needed", "1 hour", "3 hours", "6 hours"], correctIndex: 3 },
      { question: "Can one eat a meal with both meat and fish on the same table?", options: ["Yes, with no restriction", "Yes, but they should be kept separate", "No, it is forbidden", "Only if there is bread between them"], correctIndex: 1 },
    ],
  },
  {
    videoId: 4,
    qs: [
      { question: "What does seif 8 deal with regarding pots used for meat?", options: ["Kashering pots", "Using a meat pot for dairy cooking", "Selling used pots", "Toiveling pots"], correctIndex: 1 },
      { question: "What is 'ben yomo' regarding a pot?", options: ["A pot used within the last 24 hours", "A new pot", "A pot used for Shabbos", "A pot belonging to a minor"], correctIndex: 0 },
      { question: "What is the halacha of cooking dairy in a meat pot that is not 'ben yomo'?", options: ["Permitted l'chatchilah", "Forbidden biblically", "Permitted b'dieved, food is permitted", "Forbidden rabbinically, food is forbidden"], correctIndex: 3 },
      { question: "What is the halacha of cooking dairy in a meat pot that IS ben yomo?", options: ["Permitted", "Forbidden and the food is forbidden", "Permitted b'dieved", "Depends on the amount"], correctIndex: 1 },
      { question: "What does 'nat bar nat' mean?", options: ["A flavor transferred twice", "A pot used twice", "A double prohibition", "Second generation absorbed taste"], correctIndex: 3 },
      { question: "According to seif 9, what is the status of 'nat bar nat d'heteira'?", options: ["Biblically forbidden", "Rabbinically forbidden", "Permitted l'chatchilah", "Permitted only b'dieved"], correctIndex: 3 },
      { question: "Who is more lenient regarding 'nat bar nat' — Mechaber or Rema?", options: ["Mechaber is more lenient", "Rema is more lenient", "They agree", "Neither discusses it"], correctIndex: 0 },
      { question: "According to seif 10, what is the halacha if one stirred hot dairy food with a meat spoon?", options: ["Always forbidden", "Permitted if spoon was not ben yomo", "Always permitted", "Depends on 1/60"], correctIndex: 1 },
      { question: "What is 'kli rishon'?", options: ["The original pot on the fire", "The first pot purchased", "The primary vessel", "A pot used on Yom Tov"], correctIndex: 0 },
      { question: "What is the difference in halacha between kli rishon and kli sheini?", options: ["No difference", "Kli rishon absorbs/transfers taste, kli sheini generally does not", "Kli sheini is stricter", "Only kli sheini matters for Basar Bechalav"], correctIndex: 1 },
      { question: "Can one use the same ladle for meat and dairy soups if washed in between?", options: ["Yes always", "No, never", "Only if not ben yomo", "Only if washed with soap"], correctIndex: 2 },
      { question: "What is the halacha if dairy spilled onto a meat pot from the outside while on the fire?", options: ["The pot is forbidden", "Depends on 1/60 ratio", "Always permitted", "Requires kashering"], correctIndex: 3 },
      { question: "According to seif 10, what makes a knife 'sharp' (charif) for halachic purposes?", options: ["A knife that was just sharpened", "A knife used to cut sharp/pungent foods", "A new knife", "A knife used within 24 hours"], correctIndex: 1 },
      { question: "What does a 'charif' (sharp/pungent food) do to halachic absorption?", options: ["Has no effect", "Increases the transfer of taste", "Decreases the transfer of taste", "Only affects permitted foods"], correctIndex: 1 },
      { question: "Which food is a classic example of 'davar charif'?", options: ["Bread", "Onion", "Apple", "Fish"], correctIndex: 1 },
    ],
  },
  {
    videoId: 5,
    qs: [
      { question: "What does seif 11 discuss in Siman 87?", options: ["The prohibition of cooking meat and milk", "Bishul akum with meat and milk", "The status of animal stomachs used as rennet", "The waiting period"], correctIndex: 2 },
      { question: "What is the halacha regarding rennet (kavah) from a non-slaughtered kosher animal?", options: ["Permitted", "Biblically forbidden", "Rabbinically forbidden", "Depends on the amount"], correctIndex: 1 },
      { question: "What is the halacha regarding rennet from a properly slaughtered kosher animal used to curdle milk?", options: ["Forbidden", "Permitted", "Rabbinically forbidden", "Requires a Rav's decision"], correctIndex: 0 },
      { question: "Siman 88 primarily deals with which topic?", options: ["Waiting between meat and milk", "Milk that fell into meat", "Fish with meat", "The prohibition of gevinas akum"], correctIndex: 2 },
      { question: "According to Siman 88, is there a prohibition to eat fish with meat?", options: ["No prohibition at all", "Biblical prohibition", "Rabbinic prohibition based on danger to health", "Permitted but some are stringent"], correctIndex: 2 },
      { question: "What does 'sakana' mean in the context of fish and meat?", options: ["A financial loss", "A danger to health", "A spiritual danger", "A prohibition"], correctIndex: 1 },
      { question: "According to Siman 89 seif 1, what must one do before eating dairy after meat?", options: ["Nothing", "Rinse mouth only", "Wait 6 hours and rinse mouth", "Wash hands"], correctIndex: 2 },
      { question: "What is the reason for the 6-hour wait according to most Rishonim?", options: ["The taste of meat remains", "It is a biblical requirement", "Meat hardens and stays in the teeth", "Both taste and physical remains"], correctIndex: 3 },
      { question: "According to the Rambam, what is the reason for waiting 6 hours?", options: ["Meat taste lingers", "Meat stays between teeth", "Both reasons", "It is a custom only"], correctIndex: 0 },
      { question: "What does the Mechaber rule about the waiting period?", options: ["1 hour", "3 hours", "6 hours", "No waiting required"], correctIndex: 2 },
      { question: "Is the 6-hour wait a biblical or rabbinic requirement?", options: ["Biblical", "Rabbinic", "A minhag only", "Disputed"], correctIndex: 1 },
      { question: "What does Siman 89 say about one who is sick regarding the waiting period?", options: ["Must still wait 6 hours", "May be lenient", "No waiting required", "Must wait only 1 hour"], correctIndex: 1 },
      { question: "Can one eat dairy immediately after eating meat if they did not actually taste the meat?", options: ["Yes", "No, must still wait", "Only if they rinsed mouth", "Depends on the posek"], correctIndex: 2 },
      { question: "What is the halacha of one who ate meat at the end of Shabbos regarding eating dairy at Melaveh Malka?", options: ["Must wait 6 hours from Shabbos meal", "Can eat dairy at Melaveh Malka immediately", "Wait only 1 hour", "No dairy at Melaveh Malka"], correctIndex: 0 },
      { question: "What is the Rema's position on Dutch (Holland) Jews who wait only 1 hour?", options: ["Forbidden", "Permitted as their established custom", "Only permitted for the elderly", "Must change their custom"], correctIndex: 1 },
    ],
  },
  {
    videoId: 6,
    qs: [
      { question: "According to Siman 89 seif 1, when is rinsing the mouth required before eating dairy after meat?", options: ["Always required", "Only after eating a full meal of meat", "After eating any amount of meat", "Only for Ashkenazim"], correctIndex: 2 },
      { question: "What foods can be used to rinse the mouth between meat and dairy?", options: ["Bread only", "Water only", "Bread, water, or other foods", "Only hard foods"], correctIndex: 2 },
      { question: "According to seif 2, is there a requirement to wash hands between meat and dairy?", options: ["Yes, always required", "Required according to some poskim, but not universally", "Not required at all", "Required only for Sephardim"], correctIndex: 1 },
      { question: "According to seif 3, what is the halacha of dairy that fell into meat?", options: ["Always forbidden", "Requires bitul b'shishim (1/60)", "Always permitted", "Depends on whether it was cooked"], correctIndex: 1 },
      { question: "What is 'bitul b'shishim'?", options: ["Nullification in 60 parts", "A waiting period of 60 minutes", "60 seconds of rinsing", "A measurement of 60 grams"], correctIndex: 0 },
      { question: "Does bitul b'shishim apply to Basar Bechalav on a biblical level?", options: ["Yes", "No, it only applies rabbinically here", "Only in certain cases", "Never applies to Basar Bechalav"], correctIndex: 0 },
      { question: "What is the halacha if a drop of milk fell into a large pot of meat soup?", options: ["The entire pot is forbidden", "If there is 60 times the milk, the soup is permitted", "Always permitted", "Requires a Rav's decision always"], correctIndex: 1 },
      { question: "What is 'davar hamaamid' in the context of Basar Bechalav?", options: ["Something that solidifies or congeals the mixture", "Something that adds flavor", "A forbidden ingredient", "A permitted additive"], correctIndex: 0 },
      { question: "What is the halacha if a 'davar hamaamid' of milk falls into meat?", options: ["Can be nullified in 60", "Cannot be nullified even in large amounts", "Permitted if less than a kezayis", "Depends on the type of meat"], correctIndex: 1 },
      { question: "According to seif 3, what happens if one cannot tell how much milk fell in?", options: ["Assume the worst — forbidden", "Assume permitted", "Ask a Rav", "Depends on the situation"], correctIndex: 2 },
      { question: "What is the halacha if the pot of meat is on the fire when milk falls in?", options: ["Same as off the fire", "More stringent because heat increases absorption", "More lenient because heat burns off the milk", "No difference in halacha"], correctIndex: 1 },
      { question: "Who has the ability to nullify a forbidden mixture?", options: ["Any person", "Only a Rav (halachic authority)", "Only the owner of the food", "Anyone who knows the halacha"], correctIndex: 1 },
      { question: "Can one intentionally add more meat to nullify milk that fell in?", options: ["Yes", "No, one may not intentionally cause bitul", "Only a Rav may do this", "Only before it is cooked"], correctIndex: 1 },
      { question: "What is 'yavesh b'yavesh' in Basar Bechalav?", options: ["Wet mixture of meat and milk", "Dry meat touching dry dairy", "A stringent rabbinic rule", "A type of vessel"], correctIndex: 1 },
      { question: "According to Siman 89, what is the halacha of 'yavesh b'yavesh' — dry meat touching dry dairy?", options: ["Forbidden in all cases", "The surface may be removed and the rest is permitted", "Permitted in all cases", "Requires checking by a Rav"], correctIndex: 1 },
    ],
  },
  {
    videoId: 7,
    qs: [
      { question: "According to Siman 89 seif 3, what is the halacha when meat gravy drips onto cheese?", options: ["The cheese is forbidden", "Remove the surface and the rest is permitted", "The cheese is fully permitted", "Depends on 1/60"], correctIndex: 3 },
      { question: "What is 'rotev' in the context of Basar Bechalav?", options: ["A type of pot", "Gravy or liquid from meat", "Milk residue", "A term for forbidden food"], correctIndex: 1 },
      { question: "According to seif 4, what is the halacha of using a tablecloth used for meat for a dairy meal?", options: ["Completely forbidden", "Permitted if the cloth is clean", "Forbidden unless washed", "Only permitted if a Rav permits it"], correctIndex: 1 },
      { question: "What is 'kavush' in the context of Basar Bechalav?", options: ["Food that was salted", "Food that was soaked for a period of time", "Cooked food", "Roasted food"], correctIndex: 1 },
      { question: "What is the halachic rule about 'kavush k'mevushal'?", options: ["Soaking is like cooking regarding taste transfer", "Soaking is completely different from cooking", "Soaking only applies to vegetables", "Soaking applies only to prohibited mixtures"], correctIndex: 0 },
      { question: "For how long must food be soaked to have the status of 'kavush'?", options: ["1 hour", "3 hours", "24 hours", "12 hours"], correctIndex: 2 },
      { question: "What does seif 4 say about salting meat on a board?", options: ["May not use the same board for dairy", "May use the same board if cleaned", "No restriction on the board", "Must use a separate board always"], correctIndex: 1 },
      { question: "Is there a difference between a wooden board and a plastic board for separating meat and dairy use?", options: ["No difference", "Wood is more stringent as it absorbs", "Plastic is more stringent", "Only glass makes a difference"], correctIndex: 1 },
      { question: "According to the poskim, how does one kasher a wooden cutting board that absorbed meat?", options: ["Wash with cold water", "Libun (direct flame)", "Hagalah (boiling water immersion)", "No kashering possible"], correctIndex: 2 },
      { question: "What is the status of bread baked in a meat oven for use at a dairy meal?", options: ["Fully forbidden", "Permitted if oven was clean", "Only permitted b'dieved", "Always permitted"], correctIndex: 1 },
      { question: "According to the Shach, what is the halacha regarding 'irui' (pouring) of hot meat liquid onto dairy?", options: ["Same as direct cooking", "Less severe than cooking", "Has no halachic effect", "Only relevant for biblical prohibitions"], correctIndex: 0 },
      { question: "What is 'tzli' (roasting) in the context of Basar Bechalav?", options: ["Cooking in water", "Cooking in oil", "Direct heat/roasting without liquid", "Frying"], correctIndex: 2 },
      { question: "Does roasting meat near dairy create a prohibition according to the Mechaber?", options: ["Yes always", "Only if they touch", "Only the steam matters", "No prohibition"], correctIndex: 1 },
      { question: "What is the concern of 'reicha' (aroma/smell) in Basar Bechalav?", options: ["It is a biblical prohibition", "Ashkenazim are stringent regarding strong aromas mixing", "It is completely permitted", "Only applies to fish"], correctIndex: 1 },
      { question: "According to seif 3-4, what must one do if meat accidentally touched cheese?", options: ["Both are forbidden", "Wash the touched area and the rest is permitted", "Only the cheese is forbidden", "Depends on the type of cheese"], correctIndex: 1 },
    ],
  },
  {
    videoId: 8,
    qs: [
      { question: "What does Siman 91 seif 1 primarily discuss?", options: ["The waiting period between meat and milk", "Separating meat and dairy on the table", "The prohibition of cooking milk and meat", "Eating meat and dairy at the same table"], correctIndex: 3 },
      { question: "According to seif 1, may two people eat at the same table if one eats meat and one eats dairy?", options: ["Completely forbidden", "Permitted with a heker (recognizable separator)", "Permitted without any restriction", "Only if they are strangers"], correctIndex: 1 },
      { question: "What is a 'heker' in the context of Siman 91?", options: ["A verbal agreement not to share food", "A recognizable physical reminder/separator on the table", "A separate tablecloth", "A sign on the wall"], correctIndex: 1 },
      { question: "According to seif 2, which people may eat meat and dairy at the same table without restriction?", options: ["All family members", "Two people who do not know each other", "People who know each other well and would not share", "Children only"], correctIndex: 1 },
      { question: "What is the halacha of a husband and wife eating — one meat and one dairy — at the same table?", options: ["Forbidden always", "Requires a heker", "Permitted since they know each other well", "Requires a separate table"], correctIndex: 2 },
      { question: "What does seif 3 say about using the same tablecloth for both meat and dairy?", options: ["Forbidden", "Permitted if the tablecloth is clean", "Requires changing the tablecloth between meals", "Only permitted for family members"], correctIndex: 2 },
      { question: "According to seif 4, may one place meat and dairy foods in the same oven at the same time?", options: ["Always forbidden", "Permitted if they are covered", "Permitted if they do not touch", "Forbidden even if covered, if strong-smelling foods"], correctIndex: 1 },
      { question: "What is the halacha of warming dairy food in an oven that was used for meat (clean, not ben yomo)?", options: ["Completely forbidden", "Permitted", "Only permitted b'dieved", "Requires a Rav's decision"], correctIndex: 1 },
      { question: "According to the poskim, can a microwave be used for both meat and dairy?", options: ["Yes, without restriction", "No, never", "Yes, but requires separate times and cleaning between uses", "Only if covered"], correctIndex: 2 },
      { question: "What is 'zeiah' (steam) in the context of Siman 91?", options: ["A type of forbidden mixture", "Steam that rises from food in an oven", "A rabbinic decree", "A kashering method"], correctIndex: 1 },
      { question: "According to the Rema, what is the concern with 'zeiah' (steam) in an oven?", options: ["No concern at all", "Steam can transfer taste and cause problems", "Only a concern for biblical prohibitions", "Only applies to liquids"], correctIndex: 1 },
      { question: "According to seif 1, may one place meat and fish on the same table?", options: ["Yes, without restriction", "No, forbidden", "Only if separated", "Permitted but one must wash between them"], correctIndex: 0 },
      { question: "What is the halacha regarding using separate sponges for meat and dairy dishes?", options: ["Not required", "Required according to most poskim", "Only required for Ashkenazim", "Only required for frum households"], correctIndex: 1 },
      { question: "According to seif 4, can one use the same sink for washing meat and dairy dishes?", options: ["Forbidden", "Permitted if done separately", "Requires a physical divider in the sink", "Only permitted with cold water"], correctIndex: 1 },
      { question: "What is the summary ruling regarding having two sets of dishes (meat and dairy)?", options: ["A biblical requirement", "A rabbinic requirement", "A widespread and important custom", "Not required at all"], correctIndex: 2 },
    ],
  },
];

async function main() {
  for (const { videoId, qs } of allQuestions) {
    console.log(`Inserting ${qs.length} questions for video ${videoId}...`);
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      const [newQ] = await db.insert(questions).values({
        videoId,
        text: q.question,
        order: i + 1,
      }).returning();
      for (let j = 0; j < q.options.length; j++) {
        await db.insert(questionOptions).values({
          questionId: newQ.id,
          text: q.options[j],
          isCorrect: j === q.correctIndex,
        });
      }
    }
    console.log(`  ✓ Done`);
  }
  console.log('\nAll questions seeded!');
}

main().catch(console.error);
