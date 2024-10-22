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
                        <p className="text-sm text-neutral-300">{description}</p>
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

export function TechStartup() {
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
      <div className="overflow-hidden py-16 sm:py-24 lg:py-40">
         <Container>
            <FadeIn>
               <div ref={setReferenceWindowRef}>
                  <h3 className="max-w-3xl text-pretty text-4xl font-medium tracking-tighter text-neutral-950 data-[dark]:text-white sm:text-6xl">
                     Tech Startup Track by Rackspace
                  </h3>
                  <h2 className="mt-6 max-w-xl text-xl text-neutral-600">
                     <strong>Elevate Your Tech Strategy!</strong>{' '} 
                     Gain insights from industry leaders, learn about the latest tech trends, and explore strategies for driving business success
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
      img: 'https://media.licdn.com/dms/image/v2/C4D03AQGEZjHfP-XgTg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1580413347613?e=1733356800&v=beta&t=UZFamjvPVyqyrigyDYQeavRnb6wLjRVHS3-O-FK3oM0',
      name: 'Justin Pelletier',
      title: 'Global Enterprise Discount Manager',
      topic: 'Leveraging Funding and Support from Hyperscalers',
      time: '10:00 AM - 11:00 AM',
      description: 'Overview of funding mechanisms and support programs available from major hyperscalers (AWS, Azure, GCP). How to apply for and maximize benefits from these programs Case studies of startups that successfully leveraged these programs. Practical tips on building relationships with hyperscaler account managers and solution architects. Additional speakers: Matthew Parker, and Zach Symm',
      link: 'https://www.linkedin.com/in/justinpelletier/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C5603AQE-XYq1FqFUDA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1589564608300?e=1735171200&v=beta&t=pt_Oi_b-hSxNHeOEmRt2yVjTTsP0s44UbK0iDlxXBKQ',
      name: 'Mitch Howie',
      title: 'Account Executive at Rackspace',
      topic: 'Leveraging Funding and Support from Hyperscalers',
      time: '10:00 AM - 11:00 AM',
      description: 'Overview of funding mechanisms and support programs available from major hyperscalers (AWS, Azure, GCP). How to apply for and maximize benefits from these programs Case studies of startups that successfully leveraged these programs. Practical tips on building relationships with hyperscaler account managers and solution architects. Additional speakers: Matthew Parker, and Zach Symm',
      link: 'https://www.linkedin.com/in/justinpelletier/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQFEamlpnENOKw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1729191101199?e=1735171200&v=beta&t=5mPK_Z05TsQgiTQClry20E6HPxecBP71cUEbei3SMNU',
      name: 'Zachary Symm',
      title: 'Product Manager for Managed Public Cloud',
      topic: 'Leveraging Funding and Support from Hyperscalers',
      time: '10:00 AM - 11:00 AM',
      description: 'Overview of funding mechanisms and support programs available from major hyperscalers (AWS, Azure, GCP). How to apply for and maximize benefits from these programs Case studies of startups that successfully leveraged these programs. Practical tips on building relationships with hyperscaler account managers and solution architects. Additional speakers: Matthew Parker, and Zach Symm',
      link: 'https://www.linkedin.com/in/zsymm/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQGUOD-xAb1bJQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1667440147089?e=1735171200&v=beta&t=TY_LlZgmbh1OAHEWDuN2gmSIkO95kiy7o2jVAGBXsxs',
      name: 'Matthew Parker',
      title: 'Director, Public Cloud Managed Services',
      topic: 'Leveraging Funding and Support from Hyperscalers',
      time: '10:00 AM - 11:00 AM',
      description: 'Overview of funding mechanisms and support programs available from major hyperscalers (AWS, Azure, GCP). How to apply for and maximize benefits from these programs Case studies of startups that successfully leveraged these programs. Practical tips on building relationships with hyperscaler account managers and solution architects. Additional speakers: Matthew Parker, and Zach Symm',
      link: 'https://www.linkedin.com/in/matthew-parker-a8b859148/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C4E03AQET5_qEHgFCHA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1548364112858?e=1735171200&v=beta&t=qpID4UjHCaH2nY3HLNbdim4oT9ha-2EsLMxanync9I0',
      name: 'Dennis George',
      title: 'AWS - Sr. Partner Solutions Architect',
      topic: 'Security Best Practices in the Cloud',
      time: '11:20 PM - 12:10 PM',
      description: 'A session focused on mastering cloud security through the shared responsibility model, covering essential practices like identity management and encryption, automated security assessments, incident response planning, and real-world breach case studies with key lessons learned.',
      link: 'https://www.linkedin.com/in/dennisgeorg/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQEJgLch8QuM_A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1629813347608?e=1735171200&v=beta&t=LjRv73T7oPZIIeK6v69rBG2rNRFQ2TAHL0p95aQQLSo',
      name: 'Adam Brown',
      title: 'Security Analyst IV at Rackspace',
      topic: 'Security Best Practices in the Cloud',
      time: '11:20 PM - 12:10 PM',
      description: 'A session focused on mastering cloud security through the shared responsibility model, covering essential practices like identity management and encryption, automated security assessments, incident response planning, and real-world breach case studies with key lessons learned.',
      link: 'https://www.linkedin.com/in/adam-brown-98897431/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D4E03AQGg1cWx1bn1Qg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1691540993462?e=1735171200&v=beta&t=V4aWXXjIEeSMNL2SD2x6GJbA3JE9tQSW0HnTG6INTFs',
      name: 'Jonathan Loeffler',
      title: 'Senior Manager, Cloud Practice Engineering',
      topic: 'Balancing Simplicity and Complexity in Cloud Architecture',
      time: '12:30 PM - 1:20 PM',
      description: 'This session will focus on designing simple and maintainable cloud architectures. Covering the principles of simplicity, identifying areas where complexity is necessary, and using tools and services to manage complexity. The session plans to also discusses strategies for incremental adoption of complex services and provides case studies on maintaining simplicity in high-growth environments.',
      link: 'https://www.linkedin.com/in/jonathan-loeffler-52b490287/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C4E03AQG44keUIcTfog/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1540742325545?e=1735171200&v=beta&t=wUHTQzFF-F1ZHCl-2hodZWtzyuDtnS_aDu9DCHaSo1g',
      name: 'Tom Prather',
      title: 'Manager, Fanatical AWS Support',
      topic: 'Balancing Simplicity and Complexity in Cloud Architecture',
      time: '12:30 PM - 1:20 PM',
      description: 'This session will focus on designing simple and maintainable cloud architectures. Covering the principles of simplicity, identifying areas where complexity is necessary, and using tools and services to manage complexity. The session plans to also discusses strategies for incremental adoption of complex services and provides case studies on maintaining simplicity in high-growth environments.',
      link: 'https://www.linkedin.com/in/tom-prather-8b749012/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C5603AQHa95urSZwfYg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1574129101028?e=1735171200&v=beta&t=Ba_JbDSZlHUyIHavmVEJsgn8YSth8q-7K2d-qsnh3dM',
      name: 'Chris Clark',
      title: 'Mobile Security Engineer at Meta',
      topic: 'Building Scalable Architectures to Support Business Growth',
      time: '1:40 PM - 2:30 PM',
      description: 'The session focuses on designing scalable cloud architectures. Covering key principles and best practices for building scalable systems, including choosing appropriate storage, compute, and networking services. The talk plans to also explore multi-region deployments and disaster recovery strategies, as well as the benefits of using serverless technologies for automatic scaling, providing real-world examples of scalable architectures and lessons learned from successful implementations.',
      link: 'https://www.linkedin.com/in/chris-clark-10700373/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C4E03AQHEIfMn8DTT1A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1517666899367?e=1735171200&v=beta&t=Pd7vh5o77yO-07I4Ez10pIrTK2uoaNVX1RsLyQMWmOU',
      name: 'Gerry Le Canu',
      title: 'Principal Solutions Architect',
      topic: 'Building Scalable Architectures to Support Business Growth',
      time: '1:40 PM - 2:30 PM',
      description: 'The session focuses on designing scalable cloud architectures. Covering key principles and best practices for building scalable systems, including choosing appropriate storage, compute, and networking services. The talk plans to also explore multi-region deployments and disaster recovery strategies, as well as the benefits of using serverless technologies for automatic scaling, providing real-world examples of scalable architectures and lessons learned from successful implementations.',
      link: 'https://www.linkedin.com/in/glecanu/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C4E03AQGQdYx_Hvrmrg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1608075520355?e=1735171200&v=beta&t=Draln9vBhL1VbnM91aojAo3vQU5o9jne4oJB185urSM',
      name: 'Eddie Dennis',
      title: 'Lead Cloud Practice Architect',
      topic: 'Building Scalable Architectures to Support Business Growth',
      time: '1:40 PM - 2:30 PM',
      description: 'The session focuses on designing scalable cloud architectures. Covering key principles and best practices for building scalable systems, including choosing appropriate storage, compute, and networking services. The talk plans to also explore multi-region deployments and disaster recovery strategies, as well as the benefits of using serverless technologies for automatic scaling, providing real-world examples of scalable architectures and lessons learned from successful implementations.',
      link: 'https://www.linkedin.com/in/eddie-dennis-31098559/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQGldQNGONVo3A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1682104358823?e=1735171200&v=beta&t=g2kEofzHIEjdB227H2p7c1uzdnIKLez5vpX2DL_I3qQ',
      name: 'Itari Ighoroje',
      title: 'Chief Architect',
      topic: 'Building Scalable Architectures to Support Business Growth',
      time: '1:40 PM - 2:30 PM',
      description: 'The session focuses on designing scalable cloud architectures. Covering key principles and best practices for building scalable systems, including choosing appropriate storage, compute, and networking services. The talk plans to also explore multi-region deployments and disaster recovery strategies, as well as the benefits of using serverless technologies for automatic scaling, providing real-world examples of scalable architectures and lessons learned from successful implementations.',
      link: 'https://www.linkedin.com/in/itari-ighoroje-a6a15780/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C5603AQF6qIb28tDmQw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516899570361?e=1735171200&v=beta&t=pU8kQ9WVS1NWCZxOZ59-tdQ6d-sAJETL8ErCvbO9LsU',
      name: 'Josh Prewitt',
      title: 'SVP Global PreSales',
      topic: 'Avoiding and Managing Technical Debt in the Cloud',
      time: '2:50 PM - 3:40 PM',
      description: "This session will focus on understanding technical debt and its impact on startup growth. Cover strategies to avoid technical debt when designing cloud architectures, as well as tools and practices for managing and paying down existing debt. This panel also plans to explore how to balance innovation with technical debt in fast-paced environments, sharing case studies of startups that successfully managed technical debt",
      link: 'https://www.linkedin.com/in/joshprewitt/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C4D03AQHw77uqYWdM7w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1586534382510?e=1735171200&v=beta&t=0-hz8FMc6IxmxXD28FHfjw0wvnTlLg0X5tPpTU7zGkM',
      name: 'Travis Runty',
      title: 'CTO, Public Cloud',
      topic: 'Avoiding and Managing Technical Debt in the Cloud',
      time: '2:50 PM - 3:40 PM',
      description: "This session will focus on understanding technical debt and its impact on startup growth. Cover strategies to avoid technical debt when designing cloud architectures, as well as tools and practices for managing and paying down existing debt. This panel also plans to explore how to balance innovation with technical debt in fast-paced environments, sharing case studies of startups that successfully managed technical debt",
      link: 'https://www.linkedin.com/in/trunty/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQHaL-LqchOm_w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726877382351?e=1735171200&v=beta&t=Pw4uoTnslxyBvBWZ4fPZVuUDl_DiXLiOHSjw7yySEzM',
      name: 'Heidi Leach',
      title: 'Vice President, Startup Banking at JPMorgan',
      topic: 'Forks in the Road: Navigating the Best Funding Paths for Your Technology Company',
      time: '4:00 PM - 5:00 PM',
      description: "During this session, we’ll sit down with an expert panel assembled by the JPMorgan Startup Banking team to unravel the nuances and gain valuable insights into the merits and demerits of each choice, empowering you as a founder to make informed and strategic decisions.",
      link: 'https://www.linkedin.com/in/trunty/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/D5603AQH3XwCeybYVbw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724512855638?e=1735171200&v=beta&t=sD_sLjwHb4j4jv3mDClwtId9EUe50PcrxvR--HplSps',
      name: 'Sebastian Garzon',
      title: 'Executive Director, Alamo Angels',
      topic: 'Forks in the Road: Navigating the Best Funding Paths for Your Technology Company',
      time: '4:00 PM - 5:00 PM',
      description: "During this session, we’ll sit down with an expert panel assembled by the JPMorgan Startup Banking team to unravel the nuances and gain valuable insights into the merits and demerits of each choice, empowering you as a founder to make informed and strategic decisions.",
      link: 'https://www.linkedin.com/in/juansebastiangarzon/',
   },
   {
      img: 'https://media.licdn.com/dms/image/v2/C4E03AQG9n962eJu2Nw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1598575510339?e=1735171200&v=beta&t=gMZxlljYYiSbQ1fBSawJuv6wHoUpsR5da1PNHmYcJZs',
      name: 'David Mandell',
      title: 'Co-Founder, Managing Director at Massive',
      topic: 'Forks in the Road: Navigating the Best Funding Paths for Your Technology Company',
      time: '4:00 PM - 5:00 PM',
      description: "During this session, we’ll sit down with an expert panel assembled by the JPMorgan Startup Banking team to unravel the nuances and gain valuable insights into the merits and demerits of each choice, empowering you as a founder to make informed and strategic decisions.",
      link: 'https://www.linkedin.com/in/davidgmandell/',
   },
];