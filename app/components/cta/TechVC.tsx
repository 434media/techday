import {
   AnimatePresence,
   MotionValue,
   motion,
   useMotionValueEvent,
   useScroll,
   useSpring,
   type HTMLMotionProps,
} from 'framer-motion';
import * as Headless from '@headlessui/react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import useMeasure, { type RectReadOnly } from 'react-use-measure';
import { Container } from '~/components/ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { XCircleIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';

function TopicCard({
   name,
   title,
   img,
   time,
   description,
   link,
   topic,
   bounds,
   scrollX,
   isActive,
   onClick,
   ...props
}: {
   img: string;
   name: string;
   title: string;
   time: string;
   description: string;
   link: string;
   topic: string;
   isActive: boolean;
   onClick: () => void;
   bounds: RectReadOnly;
   scrollX: MotionValue<number>;
} & HTMLMotionProps<'div'>) {
   let ref = useRef<HTMLDivElement | null>(null);

   let computeOpacity = useCallback(() => {
      let element = ref.current;
      if (!element || bounds.width === 0) return 1;

      let rect = element.getBoundingClientRect();

      if (rect.left < bounds.left) {
         let diff = bounds.left - rect.left;
         let percent = diff / rect.width;
         return Math.max(0.5, 1 - percent);
      } else if (rect.right > bounds.right) {
         let diff = rect.right - bounds.right;
         let percent = diff / rect.width;
         return Math.max(0.5, 1 - percent);
      } else {
         return 1;
      }
   }, [ref, bounds.width, bounds.left, bounds.right]);

   let opacity = useSpring(computeOpacity(), {
      stiffness: 100,
      damping: 20,
   });

   useLayoutEffect(() => {
      opacity.set(computeOpacity());
   }, [computeOpacity, opacity]);

   useMotionValueEvent(scrollX, 'change', () => {
      opacity.set(computeOpacity());
   });

   return (
      <motion.div
         ref={ref}
         style={{ opacity }}
         {...props}
         className={clsx(
            'relative flex aspect-[9/16] w-72 shrink-0 snap-start scroll-ml-[var(--scroll-padding)] flex-col justify-end overflow-hidden rounded-3xl sm:aspect-[3/4] sm:w-96',
            isActive && 'ring-4 ring-indigo-600 bg-opacity-25' // Add a ring and background opacity to indicate the active card
         )}
         onClick={onClick}
      >
         <img
            alt="profile headshot of speaker"
            src={img}
            className="aspect-square absolute inset-x-0 top-0 w-full object-cover"
         />
         <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black from-[calc(7/16*100%)] ring-1 ring-inset ring-neutral-950/10 sm:from-25%"
         />
         <figure className="relative p-10">
            <blockquote>
               <p className="relative text-xl/7 text-white">
                  <span
                     aria-hidden="true"
                     className="absolute -translate-x-full"
                  ></span>
                  {topic}
                  <span aria-hidden="true" className="absolute"></span>
                  <span className="mt-2 block text-sm/6 text-neutral-400">
                     {time}
                  </span>
               </p>
            </blockquote>
            <figcaption className="mt-6 border-t border-white/20 pt-6">
               <p className="text-sm/6 font-medium text-white">{name}</p>
               <p className="text-sm/6 font-medium">
                  <span className="bg-gradient-to-r from-[#fff1be] from-[28%] via-[#ee87cb] via-[70%] to-[#b060ff] bg-clip-text text-transparent">
                     {title}
                  </span>
               </p>
            </figcaption>
         </figure>
         <AnimatePresence>
            {isActive && (
               <div className="fixed inset-0 h-screen z-50 overflow-auto">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0"
                  />
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 50 }}
                     transition={{ duration: 0.3, ease: 'easeInOut' }}
                     ref={ref}
                     className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 h-fit z-[60] my-10 p-4 md:p-10 rounded-3xl font-sans relative"
                  >
                     <button
                        className="sticky top-4 right-0 ml-auto bg-black dark:bg-white rounded-full flex items-center justify-center"
                        onClick={() => onClick()}
                     >
                        <XCircleIcon className="size-4 text-white dark:text-black" />
                     </button>
                     <img
                        alt="profile headshot of speaker"
                        src={img}
                        className="mt-6 w-full h-60 object-cover rounded-t-3xl lg:hidden"
                     />
                     <motion.p
                        className="text-base font-medium text-black dark:text-white mt-4"
                     >
                        {title}
                     </motion.p>
                     <motion.p
                        className="text-2xl md:text-5xl font-semibold text-neutral-700 mt-2 dark:text-white"
                     >
                        {name}
                     </motion.p>
                     <div className="py-10">
                        <span className="mt-2 block text-sm/6 text-neutral-400">
                           {time}
                        </span>
                        <p className="text-2xl bg-gradient-to-r from-[#fff1be] from-[28%] via-[#ee87cb] via-[70%] to-[#b060ff] bg-clip-text text-transparent">{topic}</p>
                        <p className="text-sm text-neutral-300 max-w-2xl">{description}</p>
                        <a
                           href={link}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="mt-4 block text-sm text-blue-500 underline"
                        >
                           Meet the speaker
                        </a>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </motion.div>
   );
}

export function TechVC() {
   let scrollRef = useRef<HTMLDivElement | null>(null);
   let { scrollX } = useScroll({ container: scrollRef });
   let [setReferenceWindowRef, bounds] = useMeasure();
   let [activeIndex, setActiveIndex] = useState<number | null>(null);

   useMotionValueEvent(scrollX, 'change', () => {
      // Do not change activeIndex on scroll
   });

   function scrollTo(index: number) {
      let gap = 32;
      let width = (scrollRef.current!.children[0] as HTMLElement).offsetWidth;
      scrollRef.current!.scrollTo({ left: (width + gap) * index });
   }

   return (
      <div className="overflow-hidden py-16 sm:py-24">
         <Container>
            <FadeIn>
               <div ref={setReferenceWindowRef}>
                  <h3 className="max-w-3xl text-pretty text-4xl font-medium tracking-tighter text-neutral-950 data-[dark]:text-white sm:text-6xl">
                     Venture Capital Track by MGV Capital
                  </h3>
                  <h2 className="mt-6 max-w-xl text-xl text-neutral-600">
                     <strong>Fuel Your Tech Startup!</strong>{' '}
                     Dive deep into the world of venture capital and discover the latest trends and strategies
                  </h2>
               </div>
            </FadeIn>
         </Container>
         <div
            ref={scrollRef}
            className={clsx([
               'mt-16 flex gap-8 px-[var(--scroll-padding)]',
               '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
               'snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth',
               '[--scroll-padding:max(theme(spacing.6),calc((100vw-theme(maxWidth.2xl))/2))] lg:[--scroll-padding:max(theme(spacing.8),calc((100vw-theme(maxWidth.7xl))/2))]',
            ])}
         >
            {trackTalks.map(({ img, name, title, topic, time, description, link }, talkIndex) => (
               <TopicCard
                  key={talkIndex}
                  name={name}
                  title={title}
                  time={time}
                  img={img}
                  description={description}
                  link={link}
                  topic={topic}
                  bounds={bounds}
                  scrollX={scrollX}
                  isActive={activeIndex === talkIndex}
                  onClick={() => setActiveIndex(activeIndex === talkIndex ? null : talkIndex)}
               />
            ))}
            <div className="w-[42rem] shrink-0 sm:w-[54rem]" />
         </div>
         <Container className="mt-16">
            <div className="flex justify-end">
               <div className="hidden sm:flex sm:gap-2">
                  {trackTalks.map(({ name }, talkIndex) => (
                     <Headless.Button
                        key={talkIndex}
                        onClick={() => scrollTo(talkIndex)}
                        data-active={
                           activeIndex === talkIndex ? true : undefined
                        }
                        aria-label={`Scroll to testimonial from ${name}`}
                        className={clsx(
                           'size-2.5 rounded-full border border-transparent bg-neutral-300 transition',
                           'data-[active]:bg-neutral-400 data-[hover]:bg-neutral-400',
                           'forced-colors:data-[active]:bg-[Highlight] forced-colors:data-[focus]:outline-offset-4'
                        )}
                     />
                  ))}
               </div>
            </div>
         </Container>
      </div>
   );
}




const trackTalks = [
   {
      img: 'https://media.licdn.com/dms/image/v2/C4E03AQHPHiF5bOaIBw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1622931109273?e=1733356800&v=beta&t=VTlXUCNlJLorlzfASij1SSNddK1X2sAc6EcPXkd0Z4s',
      name: 'Mariano Gonzalez',
      title: 'MGV Capital General Partner',
      topic: 'State of the VC Industry and Outlook (US/Texas/LATAM)',
      time: '10:00 AM - 11:00 AM',
      description: 'A comprehensive overview of the current venture capital landscape, focusing on trends, challenges, and opportunities in the United States, Texas, and Latin America. ',
      link: 'https://www.linkedin.com/in/marianogonvas/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQG3uLhFqQjsng/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709881310086?e=1733356800&v=beta&t=G5eC1GdO-kdeCfUbEJVhrSCx4_XfzTjiXLh9XurxQpA',
      name: 'Jose Luis Silva',
      title: 'Co-Founder & Managing Partner, Dux Capital',
      topic: 'State of the VC Industry and Outlook (US/Texas/LATAM)',
      time: '10:00 AM - 11:00 AM',
      description: 'A comprehensive overview of the current venture capital landscape, focusing on trends, challenges, and opportunities in the United States, Texas, and Latin America.',
      link: 'https://www.linkedin.com/in/jlsdux/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQHXpobz64WIdg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1706052217356?e=1735776000&v=beta&t=mWj8eL52R8p4MdSTGyJfjdwdKA3cDToQNpdvoDVK7iM',
      name: 'Oksana Malysheva',
      title: 'Managing Partner, Sputnik ATX VC',
      topic: 'State of the VC Industry and Outlook (US/Texas/LATAM)',
      time: '10:00 AM - 11:00 AM',
      description: 'A comprehensive overview of the current venture capital landscape, focusing on trends, challenges, and opportunities in the United States, Texas, and Latin America.',
      link: 'https://www.linkedin.com/in/oksana-malysheva-62193a3/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C4E03AQG9n962eJu2Nw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1598575510339?e=1733356800&v=beta&t=-hKGp61NYCvT783RDHe-tfxaw9aS2Z6iLDWdl621vps',
      name: 'David Mandell',
      title: 'Co-Founder, Managing Director, Massive',
      topic: 'State of the VC Industry and Outlook (US/Texas/LATAM)',
      time: '10:00 AM - 11:00 AM',
      description: 'A comprehensive overview of the current venture capital landscape, focusing on trends, challenges, and opportunities in the United States, Texas, and Latin America.',
      link: 'https://www.linkedin.com/in/davidgmandell/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C5603AQFOB-fmCV-CFg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1652384579082?e=1735171200&v=beta&t=Ch44K-XsxuyqNX-VAyfsAJHErNXLSwMRMGNICS5vA_U',
      name: 'Pat Matthews',
      title: 'Founder & CEO at Active Capital',
      topic: 'State of the VC Industry and Outlook (US/Texas/LATAM)',
      time: '10:00 AM - 11:00 AM',
      description: 'A comprehensive overview of the current venture capital landscape, focusing on trends, challenges, and opportunities in the United States, Texas, and Latin America.',
      link: 'https://www.linkedin.com/in/pat-matthews/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D4E03AQHiljg4p8HQSA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1670625431764?e=1735776000&v=beta&t=qCG5cCbKPLc3pBf6-RxLeyp1cZ9G3UCrJfAFS7q19dc',
      name: 'Damaris Mendoza',
      title: 'Partner, 500 Startups',
      topic: 'State of the VC Industry and Outlook (US/Texas/LATAM)',
      time: '10:00 AM - 11:00 AM',
      description: 'A comprehensive overview of the current venture capital landscape, focusing on trends, challenges, and opportunities in the United States, Texas, and Latin America.',
      link: 'https://www.linkedin.com/in/damaris-mendoza-loera/',
   },
   {
      img: 'https://res.cloudinary.com/jessebubble/image/upload/v1714685480/ileana2_mif5p4.jpg',
      name: 'Ileana Gonzalez',
      title: 'Tech Bloc CEO',
      topic: 'Building a Strong Tech Ecosystem: Fostering Innovation and Growth',
      time: '11:20 AM - 12:10 PM',
      description: 'Explores the strategies needed to cultivate a robust tech ecosystem, with a focus on creating supportive environments for startups through partnerships, infrastructure, policy, and investment.',
      link: 'https://www.linkedin.com/in/ileanagonzxlez/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D4E03AQFNzkjevhTgCw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1715690616120?e=1735171200&v=beta&t=mEt6_B31o_Q8CK64oeTQF5suHQ6YDiO7AD-j-6uJ4mI',
      name: 'Beto Altamirano',
      title: 'Candidate for Mayor of San Antonio',
      topic: 'Building a Strong Tech Ecosystem: Fostering Innovation and Growth',
      time: '11:20 AM - 12:10 PM',
      description: 'Explores the strategies needed to cultivate a robust tech ecosystem, with a focus on creating supportive environments for startups through partnerships, infrastructure, policy, and investment.',
      link: 'https://www.linkedin.com/in/betoaltamirano/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQFfYXbAXTlfZA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1714991427157?e=1735776000&v=beta&t=b_0Znx_H4hM2rSWCrXNHwenxszDfw3VnbL-B-PUi8SU',
      name: 'Michelle Williams ',
      title: 'VP, MassChallenge',
      topic: 'Building a Strong Tech Ecosystem: Fostering Innovation and Growth',
      time: '11:20 AM - 12:10 PM',
      description: 'Explores the strategies needed to cultivate a robust tech ecosystem, with a focus on creating supportive environments for startups through partnerships, infrastructure, policy, and investment.',
      link: 'https://www.linkedin.com/in/bemichellew/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C5603AQFE-JVOVyqTLQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1660506371887?e=1735171200&v=beta&t=KhYbJ-jFkvUQ1S2UIk-VWwjgjllPIH_zMpC3dYLZwkM',
      name: 'Caleb Scott',
      title: 'Founder/CEO at Fabra',
      topic: 'Building a Strong Tech Ecosystem: Fostering Innovation and Growth',
      time: '11:20 AM - 12:10 PM',
      description: 'Explores the strategies needed to cultivate a robust tech ecosystem, with a focus on creating supportive environments for startups through partnerships, infrastructure, policy, and investment.',
      link: 'https://www.linkedin.com/in/cscott2021/',
   },
   {
      img: 'https://techbloc.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fcdd6ab39-b2ad-4b58-8e2e-897f04f27d12%2F1a2d9955-70a6-4041-bf7e-6c950d792dc7%2F2ed836e0-5998-4f7c-af25-d971eeb0d6dc.png?table=block&id=73ec5f7a-0183-40e9-be29-fdec8b7d7439&spaceId=cdd6ab39-b2ad-4b58-8e2e-897f04f27d12&width=2000&userId=&cache=v2',
      name: 'Will Conway',
      title: 'CEO Mailgun (exited)',
      topic: 'Building a Strong Tech Ecosystem: Fostering Innovation and Growth',
      time: '11:20 AM - 12:10 PM',
      description: 'Explores the strategies needed to cultivate a robust tech ecosystem, with a focus on creating supportive environments for startups through partnerships, infrastructure, policy, and investment.',
      link: 'https://www.linkedin.com/in/wconway/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQH3XwCeybYVbw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724512855638?e=1735171200&v=beta&t=sD_sLjwHb4j4jv3mDClwtId9EUe50PcrxvR--HplSps',
      name: 'Sebastian Garzon',
      title: 'Executive Director, Alamo Angels',
      topic: 'Fundraising Decoded: Preparing for Success',
      time: '12:30 PM - 1:20 PM',
      description: 'This topic delves into the critical aspects of startup fundraising, providing actionable insights to help entrepreneurs secure the capital they need.',
      link: 'https://www.linkedin.com/in/juansebastiangarzon/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D4E03AQHiK6gzAR8lYg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1679323280333?e=1735171200&v=beta&t=Sijb3gPssVfzuLr_mNm_4O-zjq1286n_by9_ewqbh8E',
      name: 'Lala Elizondo',
      title: 'Co founder Tule Capital & Glam Express',
      topic: 'Fundraising Decoded: Preparing for Success',
      time: '12:30 PM - 1:20 PM',
      description: 'This topic delves into the critical aspects of startup fundraising, providing actionable insights to help entrepreneurs secure the capital they need.',
      link: 'https://www.linkedin.com/in/lalaelizondo/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQFljHxwaHvnOw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1694543701224?e=1735776000&v=beta&t=vtxh787JdCgm9Z1gPOQIvNciCKZ_9hmUcCrHp28S-rI',
      name: 'Mario Garcia',
      title: 'Executive Director, Angel Hub',
      topic: 'Fundraising Decoded: Preparing for Success',
      time: '12:30 PM - 1:20 PM',
      description: 'This topic delves into the critical aspects of startup fundraising, providing actionable insights to help entrepreneurs secure the capital they need.',
      link: 'https://www.linkedin.com/in/marioagarciad/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C4E03AQFFmOsvKGknhw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1633716249610?e=1735776000&v=beta&t=7JMMpFHZUkVI9Yn47-GVZu7HK41VSivTypzIcWr_AcM',
      name: 'Joshua Sanchez',
      title: 'Co-Founder & CEO at FloatMe',
      topic: 'Fundraising Decoded: Preparing for Success',
      time: '12:30 PM - 1:20 PM',
      description: 'This topic delves into the critical aspects of startup fundraising, providing actionable insights to help entrepreneurs secure the capital they need.',
      link: 'https://www.linkedin.com/in/joshsanchezbusiness/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQE0YaM5pInZCA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1729131151498?e=1735776000&v=beta&t=2dTho7qptjQCF7e_EYssgdNQ1RzscrqRxZxtqhVQy4I',
      name: 'Justin Mckenzie',
      title: 'Executive Director, Boerne-Kendall Angel Network',
      topic: 'Fundraising Decoded: Preparing for Success',
      time: '12:30 PM - 1:20 PM',
      description: 'This topic delves into the critical aspects of startup fundraising, providing actionable insights to help entrepreneurs secure the capital they need.',
      link: 'https://www.linkedin.com/in/justinmckenzie/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D4E03AQEk8hEXtpxsLA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1694143449340?e=1735776000&v=beta&t=SErym_Qk0Ogr624GzB0exTWOFJRb31YOPFwXqK0Eau0',
      name: 'Andrea Campos',
      title: 'CEO and Founder at Yana',
      topic: 'Artificial Intelligence: Harnessing Generative AI',
      time: '1:40 PM - 2:30 PM',
      description: 'A deep dive into the transformative potential of generative AI and how startups can leverage this cutting-edge technology to drive innovation and efficiency.',
      link: 'https://www.linkedin.com/in/andrea-campos-guerra/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQFyk95S1QTHrg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726093637576?e=1735171200&v=beta&t=vVjFpDvHbKDJAdayCgr8KhA4PUpSP8C6Hf0uJ5-pZM4',
      name: 'Fernando Huerta',
      title: 'Founder of Seals AI',
      topic: 'Artificial Intelligence: Harnessing Generative AI',
      time: '1:40 PM - 2:30 PM',
      description: 'A deep dive into the transformative potential of generative AI and how startups can leverage this cutting-edge technology to drive innovation and efficiency.',
      link: 'https://www.linkedin.com/in/fernando-huerta-zuniga/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C5603AQGJE1mR4yQKkw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1552182893579?e=1735776000&v=beta&t=USxwT1PIU5eSpKlsa9uSKGCSkUhZ_TvZnVwj7p7c9TU',
      name: 'Robert Tietzch',
      title: 'Senior, CSM Architect, IBM',
      topic: 'Artificial Intelligence: Harnessing Generative AI',
      time: '1:40 PM - 2:30 PM',
      description: 'A deep dive into the transformative potential of generative AI and how startups can leverage this cutting-edge technology to drive innovation and efficiency.',
      link: 'https://www.linkedin.com/in/robtch/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C4E03AQEVYVqWFlxkEQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1643490984831?e=1735171200&v=beta&t=V3lim6VEck7UY5ZJud5tT8kAe7-NgLlIag4Lubs1xRU',
      name: 'Alfonso Garcia',
      title: 'Co-founder @Parlevel Systems',
      topic: 'Cultivating a Growth Mindset: Strategies for Startup Success',
      time: '2:50 PM - 3:40 PM',
      description: 'This session will explore the mindset and strategies that drive startups to achieve rapid growth, focusing on scaling challenges, building a resilient company culture, and fostering continuous innovation.',
      link: 'https://www.linkedin.com/in/alfgarcia/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D4D35AQGfDS0N547Vqg/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1729275528831?e=1730217600&v=beta&t=y6pa0WeBmlS4ARjWOBFc_RUVNxSK0tJNgEdrKqCMNBQ',
      name: 'Jose Alberto Diaz',
      title: 'CEO - Co-founder @Balam l Clip, Stori and Endeavor',
      topic: 'Cultivating a Growth Mindset: Strategies for Startup Success',
      time: '2:50 PM - 3:40 PM',
      description: 'This session will explore the mindset and strategies that drive startups to achieve rapid growth, focusing on scaling challenges, building a resilient company culture, and fostering continuous innovation.',
      link: 'https://www.linkedin.com/in/josealbdg/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQHYN5pUj0_lGg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719029563415?e=1735171200&v=beta&t=Qy4DkGQ6_cds97ZCoGoHQE55PgfzyhbR8NNt_8VTohI',
      name: 'Paola Villarreal',
      title: 'Entrepreneur Agent® & Author',
      topic: 'Cultivating a Growth Mindset: Strategies for Startup Success',
      time: '2:50 PM - 3:40 PM',
      description: 'This session will explore the mindset and strategies that drive startups to achieve rapid growth, focusing on scaling challenges, building a resilient company culture, and fostering continuous innovation.',
      link: 'https://www.linkedin.com/in/paolavillarrealcarvajal/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C5603AQG4e9m8QCIKOQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1667957161334?e=1735776000&v=beta&t=1QyZeEUZBX-2xQHxd7J7xgIRsv8Z5htnCPdA5uHC_a8',
      name: 'Rene Lomeli',
      title: 'Partner, 500 Startups',
      topic: 'Cultivating a Growth Mindset: Strategies for Startup Success',
      time: '2:50 PM - 3:40 PM',
      description: 'This session will explore the mindset and strategies that drive startups to achieve rapid growth, focusing on scaling challenges, building a resilient company culture, and fostering continuous innovation.',
      link: 'https://www.linkedin.com/in/rlomeli88/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C4D03AQHw77uqYWdM7w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1586534382510?e=1735171200&v=beta&t=0-hz8FMc6IxmxXD28FHfjw0wvnTlLg0X5tPpTU7zGkM',
      name: 'Travis Runty',
      title: 'CTO, Public Cloud',
      topic: 'Cybersecurity: Protecting Your Business',
      time: '4:00 PM - 5:00 PM',
      description: 'This session will examine the evolving cybersecurity landscape for startups, offering expert insights on the latest security measures and strategies to protect digital assets in a complex digital world.',
      link: 'https://www.linkedin.com/in/trunty/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C5603AQFSvlZW9AYdTA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1658979135627?e=1735171200&v=beta&t=P8pVwspJHnwHiCL9d7URuX-JaTHQGBl1OqF1yTUGfAQ',
      name: 'Santiago Fuentes',
      title: 'Co-Founder & Co-CEO @ Delta Protect',
      topic: 'Cybersecurity: Protecting Your Business',
      time: '4:00 PM - 5:00 PM',
      description: 'This session will examine the evolving cybersecurity landscape for startups, offering expert insights on the latest security measures and strategies to protect digital assets in a complex digital world.',
      link: 'https://www.linkedin.com/in/santiagofuentesr/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C4E03AQHRj9TnfqzyZw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1548440450639?e=1735776000&v=beta&t=6BLRNCaXntcwpny-i7AZLCUKuOHpsyL0LPsA_8JwvAI',
      name: 'Will Garrett',
      title: 'VP Cybersecurity, Port San Antonio',
      topic: 'Cybersecurity: Protecting Your Business',
      time: '4:00 PM - 5:00 PM',
      description: 'This session will examine the evolving cybersecurity landscape for startups, offering expert insights on the latest security measures and strategies to protect digital assets in a complex digital world.',
      link: 'https://www.linkedin.com/in/willgarrettbsf/',
   },
   
   
];
