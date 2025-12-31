'use client';

import { Button } from '@/components/ui/button';
import { createThreadInFirestore } from '@/lib/firestore'; // We'll implement this bulk function or reuse single
import { useState } from 'react';
import { CATEGORIES } from '@/lib/data';

// --- SEED DATA ---
const SEED_THREADS = [
    // 1. Films (Tollywood/Bollywood)
    { title: "Prabhas in 'Spirit' - Cop Universe Connection?", categoryId: 'c1', content: "Sandeep Reddy Vanga mentioned Spirit will be raw. Do you think it connects to his other films? Prabhas look is going to be insane!" },
    { title: "Rajamouli vs Shankar: Who handles VFX better?", categoryId: 'c1', content: "After Kalki 2898 AD and RRR, the bar is high. Can Indian 2 compete? Rajamouli seems to have the Midas touch." },
    { title: "SSMB29 Update: Globe Trotting Adventure", categoryId: 'c1', content: "Mahesh Babu + Rajamouli is the dream combo. Heard it's an Indiana Jones style jungle adventure. Thoughts?" },
    { title: "Kalki 2898 AD: The Mahabharata Sequence was GOATED", categoryId: 'c1', content: "That flashback sequence changed everything. Ashwatthama is invincible. Amitabh Bachchan stole the show." },
    { title: "Salaar Part 2: Shouryaanga Parvam Predictions", categoryId: 'c1', content: "Will Deva and Varadha actually fight? The politics in Khansaar are getting intense." },

    // 2. Cricket
    { title: "Kohli's form in T20 World Cup - Concern or Strategy?", categoryId: 'c2', content: "Is he playing too slow or just anchoring? We need vintage Kohli for the finals." },
    { title: "IPL 2026 Mega Auction: Who will RCB target?", categoryId: 'c2', content: "RCB needs a proper bowling attack. Is it time to let go of some big names? E Sala Cup Namde?" },
    { title: "Rohit Sharma's Captaincy Legacy", categoryId: 'c2', content: "5 IPL trophies, T20 World Cup. Is he the best white-ball captain India ever produced?" },
    { title: "BCCI's new domestic cricket rules - Good or Bad?", categoryId: 'c2', content: "Forcing players to play Ranji is a good move. Test cricket needs to be prioritized." },
    { title: "Thala Dhoni: Will he play one more season?", categoryId: 'c2', content: "CSK isn't the same without him. But his knee injury looks bad. Definitely the last dance." },

    // 3. Tech
    { title: "Moving to Bangalore for a startup job - Tips?", categoryId: 'c3', content: "Got an offer in HSR Layout. Rent is crazy! classic 'Bangalore Techie' problems. Any tips for finding flatmates?" },
    { title: "Hyderabad vs Bangalore: Which is the real plotting capital?", categoryId: 'c3', content: "Hyderabad infra is way better, but Bangalore has the weather and the VC money. Debate." },
    { title: "AI taking over Indian Service Companies (TCS/Infosys)", categoryId: 'c3', content: "With ChatGPT coding, what happens to the mass recruiters? Do freshers need to pivot to product?" },
    { title: "UPI is the best tech product globally. Period.", categoryId: 'c3', content: "Went to Europe and realized how painful cash/card is. UPI failure rate is basically zero now." },
    { title: "Zerodha Nithin Kamath's podcast on health", categoryId: 'c3', content: "The 'sitting is smoking' quote went viral. Are we devs doomed with back pain? Buying a standing desk." },

    // 4. Food
    { title: "Hyderabadi Biryani > Lucknowi Biryani. Fight me.", categoryId: 'c4', content: "The spice, the texture, the double masala. Nothing beats Paradise (actually Bawarchi is better). thoughts?" },
    { title: "Best Vada Pav in Mumbai?", categoryId: 'c4', content: "Ashok Vada Pav or the one outside Mithibai? Need recommendations for a food walk." },
    { title: "Why is Rameshwaram Cafe so overrated?", categoryId: 'c4', content: "Ghee IDLI is good but waiting 45 mins? Not worth it. Taaza Thindi is superior." },
    { title: "Butter Chicken origin debate - Delhi vs Punjab", categoryId: 'c4', content: "Recent court case about who invented Butter Chicken. Does it matter as long as it tastes good with Naan?" },
    { title: "Maggi variants: Meri Maggi is best with...", categoryId: 'c4', content: "Cheese, egg, or plain vegetable? What's your secret 3 AM recipe?" },

    // 5. Travel
    { title: "Goa trip canceled for the 5th time...", categoryId: 'c5', content: "Why is it so hard to coordinate with friends? Planning a solo trip now. North or South Goa?" },
    { title: "Ladakh bike trip: Royal Enfield or Himalayan?", categoryId: 'c5', content: "Planning for June. Heard the roads are getting better but altitude sickness is real." },
    { title: "Kerala in Monsoon is a vibe", categoryId: 'c5', content: "Munnar tea estates in the rain. Just magical. Stay in a houseboat in Alleppey?" },
    { title: "Hidden gems in North East India", categoryId: 'c5', content: "Meghalaya root bridges are insane. Want to visit Sikkim next. Any itinerary suggestions?" },
    { title: "Varkala: The new Goa?", categoryId: 'c5', content: "Cliffside cafes, less crowd, cheaper. Is Varkala becoming the new backpacker hub?" },

    // 6. Education
    { title: "JEE Advanced Results: The pressure is unreal", categoryId: 'c6', content: "Seeing 16 year olds studying 14 hours a day. Is the IIT tag still worth it in 2025?" },
    { title: "Life inside an Engineering Hostel", categoryId: 'c6', content: "Maggi, late night gaming, assignment copying. The best years or the worst food?" },
    { title: "MBA in India vs Abroad", categoryId: 'c6', content: "IIM ABC vs Tier 2 US Uni. Considering ROI. Education loans are scary." },
    { title: "NEET scam allegations - What's happening?", categoryId: 'c6', content: "Grace marks issue. Students are protesting. The system needs a revamp." },
    { title: "Learning to code without a CS degree", categoryId: 'c6', content: "I'm from Mech background. Can I switch to SDE? Which roadmap to follow?" },

    // 7. Auto
    { title: "Mahindra Thar ROXX - The 5 Door madness", categoryId: 'c7', content: "Waiting period is already 1 year! Is it practical for city driving in traffic?" },
    { title: "Ola Electric Scooters - Reliability issues?", categoryId: 'c7', content: "Seeing a lot of complaints about front fork breaking. Should I go for Ather instead?" },
    { title: "Tata Build Quality is tank-like", categoryId: 'c7', content: "Saw an accident where the Nexon saved the family. Safety rating matters!" },
    { title: "Traffic in Bangalore is unsolvable", categoryId: 'c7', content: "Took 2 hours to cover 5km on ORR. When will the metro complete?" },
    { title: "Best bike under 2 Lakhs for daily commute?", categoryId: 'c7', content: "Hunter 350 vs Ronin vs Classic 350. Need good mileage too." },

    // 8. Finance
    { title: "HDFC Bank stock - Why is it not moving?", categoryId: 'c8', content: "Fundamental are strong but the stock is stuck range bound. Patience test for investors." },
    { title: "Start SIP early - Power of Compounding", categoryId: 'c8', content: "Wish I started at 22. If you are reading this, start with 500 rs. Nifty 50 will grow." },
    { title: "Credit Card trap - How to get out?", categoryId: 'c8', content: "converted bill to EMI. Bad mistake. Interest rates are 36%!" },
    { title: "Crypto in India - Is it dead?", categoryId: 'c8', content: "30% tax + 1% TDS. Is anyone still trading Bitcoin or sticking to Gold?" },
    { title: "Buying a house vs Renting in 2025", categoryId: 'c8', content: "Rental yields are 3%. Home loan interest is 8.5%. Financially renting makes sense, but emotional value?" },

    // 9. Politics (Generic)
    { title: "Digital India infrastructure is impressive", categoryId: 'c9', content: "Fastag, UPI, Digilocker. The tech stack of the govt is actually world class." },
    { title: "Election discussions: State vs Center", categoryId: 'c9', content: "Voting patterns are so different. Regional parties hold so much power." },
    { title: "Infrastructure development in the last 10 years", categoryId: 'c9', content: "Highways are amazing now. Vande Bharat trains are a game changer." },
    { title: "Brain Drain: Why is everyone leaving?", categoryId: 'c9', content: "Better quality of life vs staying with family. The eternal dilemma." },
    { title: "Climate Change impact on Indian cities", categoryId: 'c9', content: "Delhi pollution, Chennai floods, Bangalore water crisis. We need sustainable cities." },

    // 10. Memes
    { title: "Corporate Majdoor memes hitting too hard", categoryId: 'c10', content: "Manager: 'We are a family'. Me: 'Ok give me property share'. *Cries in notice period*" },
    { title: "Engineering struggle memes", categoryId: 'c10', content: "Viva examiner asking definition of machine. Me: zip zap zoom." },
    { title: "Indian Parents logic compilation", categoryId: 'c10', content: "'Phone use karna band kar do sab theek ho jayega'. Universal cure." },
    { title: "Bigg Boss fights are my guilty pleasure", categoryId: 'c10', content: "Why are they fighting over eggs? Trash TV at its finest." },
    { title: "Shark Tank India memes", categoryId: 'c10', content: "'Ye sab doglapan hai'. Ashneer is missed." }
];

export default function SeedPage() {
    const [status, setStatus] = useState('Idle');
    const [progress, setProgress] = useState(0);

    async function startSeeding() {
        setStatus('Seeding...');
        setProgress(0);

        let count = 0;
        for (const t of SEED_THREADS) {
            try {
                const category = CATEGORIES.find(c => c.id === t.categoryId);
                if (!category) continue;

                await createThreadInFirestore({
                    title: t.title,
                    content: t.content,
                    categoryId: t.categoryId,
                    category: category,
                    author: {
                        id: 'guest',
                        name: 'Anonymous User',
                        role: 'user',
                        avatar: 'https://github.com/shadcn.png',
                        joinedAt: new Date().toISOString()
                    },
                    authorId: 'guest',
                    tags: ['seeded', category.slug],
                    replyCount: Math.floor(Math.random() * 50),
                    likes: Math.floor(Math.random() * 200),
                    viewCount: Math.floor(Math.random() * 1000)
                });

                count++;
                setProgress(Math.round((count / SEED_THREADS.length) * 100));
            } catch (e) {
                console.error("Error seeding thread", t.title, e);
            }
        }
        setStatus('Done! Added ' + count + ' threads.');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <h1 className="text-2xl font-bold">Database Seeder</h1>
            <p>This will inject 50+ threads into your Firestore.</p>
            <Button onClick={startSeeding} disabled={status !== 'Idle'}>
                {status === 'Idle' ? 'Start Seeding' : status}
            </Button>
            <div className="w-64 h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-sm text-muted-foreground">{progress}%</p>
        </div>
    );
}
