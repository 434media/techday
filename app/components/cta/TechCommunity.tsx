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
import { Cover } from "~/components/ui/Cover";
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
                        <p className="text-sm text-neutral-300 max-w-3xl">{description}</p>
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

export function TechCommunity() {
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
                     Tech Community Track by <Cover>DEVSA</Cover>
                  </h3>
                  <h2 className="mt-6 max-w-xl text-xl text-neutral-600">
                     <strong>Passionate Tech Enthusiast!</strong>{' '}
                     Join us in the DEVSA Community Room at Tech Day 2024 for a full day of engaging talks, and building authentic Connections 
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
      img: 'https://media.licdn.com/dms/image/v2/D4D03AQFYYmtKG1joKw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724906114965?e=1736380800&v=beta&t=HdHXzVh5EbpKuzIvMYOVqMa8Qh8fnqGhdrhGH_zGlRI',
      name: 'Crystal Poenisch',
      title: 'GTM for Emerging Tech',
      topic: 'Navigating the Cloud-Native Landscape',
      time: '10:00 AM - 11:00 PM',
      description: 'Explore the latest trends, technologies, and best practices to help you navigate the complex world of cloud-native applications.',
      link: 'https://www.linkedin.com/in/launchhacker/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C5603AQGsZ9se9i77Mw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1662253194415?e=1736380800&v=beta&t=o_g5ocyjyz9f3_mh-xAyH1xt1OR0WJH78-kraOs0fTM',
      name: 'Ryan Orsinger',
      title: 'Director of Data Science at Haven for Hope',
      topic: 'Building a Data Science Toolchain with R and Python',
      time: '11:20 PM - 12:10 PM',
      description: 'Learn how to build a powerful toolchain to tackle complex data challenges',
      link: 'https://www.linkedin.com/in/ryanorsinger/',
   },
   {
      img: 'https://res.cloudinary.com/jessebubble/image/upload/v1727650955/Rachel_Davis_Headshot_Square_Crop_t79rms.jpg',
      name: 'Rachel Davis',
      title: 'Workshop Experience Designer + Facilitator',
      topic: "Team Comms That Don't Suck: Just Lego",
      time: '12:30 PM - 1:20 PM',
      description: 'Join us for a hands-on workshop on effective team communication! Inspired by LEGO Serious Play, this interactive session will help you improve your communication skills, collaborate more effectively, and achieve better outcomes.',
      link: 'https://www.linkedin.com/in/rachdavis/',
   },
   {
      img: 'https://res.cloudinary.com/jessebubble/image/upload/v1727650955/Wes_Headshot_Square_Crop_nwcx18.jpg',
      name: 'Wes Etheredge',
      title: 'Technology Leader',
      topic: "Team Comms That Don't Suck: Just Lego",
      time: '12:30 PM - 1:20 PM',
      description: 'Join us for a hands-on workshop on effective team communication! Inspired by LEGO Serious Play, this interactive session will help you improve your communication skills, collaborate more effectively, and achieve better outcomes.',
      link: 'https://www.linkedin.com/in/wesetheredge/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQEpGeK5VHopuw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1722698749875?e=1730937600&v=beta&t=CcZWlOyBQ5voQ1MU96qJ2bWPUlAH-E3W-mWxXXDSKSw',
      name: 'Patrick Robinson',
      title: 'Professional Software Consultant',
      topic: 'Test Driven Development From Database to UI',
      time: '1:40 PM - 2:30 PM',
      description: 'Learn how to write effective tests and ensure code quality throughout your development process.',
      link: 'https://www.linkedin.com/in/patrick-robinson-dev/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQH7KT3-KFQqLw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1676941396548?e=1730937600&v=beta&t=eaS_P0DthA7fCLhFDg7aVmMGT_p40_k8WxyVbGsuVzI',
      name: 'Samad Ahmed',
      title: 'Founder of Chamoy.io',
      topic: "Exploring Swarm: OpenAI's Multi-agent Framework",
      time: '2:50 PM - 3:40 PM',
      description: "Dive deep into the world of multi-agent systems with OpenAI's Swarm. This talk will explore the capabilities and potential applications of Swarm, a powerful framework designed to facilitate the creation and training of complex multi-agent environments.",
      link: 'https://www.linkedin.com/in/samadahmed/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C5603AQGw6v8HH2SfTA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1660914421679?e=1730937600&v=beta&t=P4914QHsloxWqjZ5irl4NGAPVMsAEGL3i8tNnEtVr-c',
      name: 'Sagar Kewalramani',
      title: 'Practice Lead, Field Solution Architect',
      topic: 'The Power of Multi-Modal AI in Our Daily Lives',
      time: '4:00 PM - 5:00 PM',
      description: 'This talk will delve into the latest advancements and real-world applications of AI that combine multiple modalities like text, images, and audio.',
      link: 'https://www.linkedin.com/in/sagarkewalramani/',
   },
];
