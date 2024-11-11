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
                            Learn more
                         </a>
                      </div>
                   </motion.div>
                </div>
             )}
          </AnimatePresence>
       </motion.div>
    );
 }
 
 export function TechDemo() {
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
                      Let's Explore the Tech <Cover>Demo Room</Cover>
                   </h3>
                   <h2 className="mt-6 max-w-xl text-xl text-neutral-600">
                      With 18 Tech Demos scheduled throughout <strong>San Antonio Tech Day</strong>, every 15 minutes, there's something for everyone to experience
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
       img: 'https://media.licdn.com/dms/image/v2/C5603AQHTgU-Lf6qm7w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1547247760237?e=1736985600&v=beta&t=dKGIJTNCBYjbx4f9YT9g7bj3B8AQEeSf5OlJ-45Kn8A',
       name: 'Alberto Carrazco',
       title: 'Co-Founder of NonprofitsHQ',
       topic: 'NonprofitsHQ',
       time: '11:20 AM',
       description: 'NonprofitsHQ is a powerful platform that streamlines nonprofit operations, managing donors, fundraising, board meetings, and more',
       link: 'https://www.nonprofitshq.com/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D5603AQGXjOutnVLjnw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1729808900639?e=1736985600&v=beta&t=8Kfqqoiw6rIG4k0FiDB3YyMBT3PsN8kKgTIiDzHW3JY',
       name: 'John Martin',
       title: 'Co-founder of SAFEtech',
       topic: 'SAFEtech',
       time: '11:40 AM',
       description: 'SAFEtech revolutionizes school safety with an all-in-one digital platform, integrating features like silent panic alerts, real-time attendance, and secure messaging',
       link: 'https://safetech.company/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D5603AQHosAUMVo43Jg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1722035483459?e=1736985600&v=beta&t=V8YHrHju69QxXxP6EgLgWXCk98h4ct9M4uUOp2cNQHg',
       name: 'Iván de la garza',
       title: 'Founder at ABW Venture Studio',
       topic: "A Better World Ventures",
       time: '12:00 PM',
       description: 'Co-creating companies for a better future, we identify promising ideas, partner with experts, and validate products before scaling',
       link: 'https://abw.framer.website/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D5603AQEYCJ3UsmMuAA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719004357709?e=1736985600&v=beta&t=xqv2J4kCZAa-6uEt7vlS63H5hd1-hdu_feutb2u5XX0',
       name: 'Jesus R. Burgoa',
       title: 'Founder of CoinClick',
       topic: "CoinClick",
       time: '12:20 PM',
       description: 'CoinClick is a social-trading app that lets users trade, pay, socialize, and earn in one place, connecting creators, investors, and media',
       link: 'https://www.coinclick.co/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D4D0BAQG2JvDxdl57HQ/company-logo_200_200/company-logo_200_200/0/1684139831946/webneed_logo?e=1739404800&v=beta&t=ZFzXx_Y9jytEIrGD9ZwgTI-BG9xxjiW7TwgEBQyEUZM',
       name: 'Emanuel Cid Gonzalez',
       title: 'Customer Success Manager',
       topic: 'Webneed',
       time: '12:40 PM',
       description: 'Grow your business with innovative tech solutions. Our user-friendly platform empowers you to build professional websites and achieve financial success',
       link: 'https://webneed.com/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D4E03AQEV4cMzWe-7Qg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1718895703228?e=1736985600&v=beta&t=9hMcl8AuvsiWKbjBRNx1RvwIjB53ArMDOWOBULgEdpI',
       name: 'Adriana Garcini',
       title: 'Founder at Athlete Constellation',
       topic: "Athlete Constellation",
       time: '1:00 PM',
       description: "Athlete Constellation is a social network for young athletes to connect, showcase skills, and get discovered by coaches and scouts.",
       link: 'https://www.linkedin.com/company/athleteconstellation/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D5603AQH7KT3-KFQqLw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1676941396548?e=1736985600&v=beta&t=zNlOvQaPF6nesdO55EXbTECAcTxbKsndAwUtDmrfQLw',
       name: 'Samad Ahmed',
       title: 'Founder of Chamoy',
       topic: 'Chamoy',
       time: '1:20 PM',
       description: "Accelerate hiring with Chamoy's AI-powered platform. Screen, evaluate, and hire the best candidates, removing bias and building stronger teams",
       link: 'https://www.chamoy.io/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D560BAQFiIBd5WpXV-Q/company-logo_200_200/company-logo_200_200/0/1728922862416/tcs_it_logo?e=1739404800&v=beta&t=0CqQUF1SbU3ny-IqViUJa9pinjPNw8E1TLjCh71scyU',
       name: 'Paul Wouters & Sean Gangwer',
       title: 'Founders of TechCare Solutions',
       topic: 'TechCare Solutions',
       time: '1:40 PM',
       description: 'Drive digital excellence with reliable and scalable online infrastructure. We help businesses establish and maintain their online presence',
       link: 'https://www.linkedin.com/in/paul-wouters/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D5603AQFpw9SmCBb0iA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1686174654977?e=1736985600&v=beta&t=af3hTomahBXD3481VhWNPguHMJe3VV3Mhp8bfdx3oLc',
       name: 'Laura Ruiz-Roehrs',
       title: 'Founder of Code Flight',
       topic: 'Code Flight',
       time: '2:00 PM',
       description: "Learn to code at your own pace with Code Flight's personalized learning platform.",
       link: 'https://my.codeflight.io/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/C560BAQH_oUgDug2ueA/company-logo_200_200/company-logo_200_200/0/1662518564184?e=1739404800&v=beta&t=yzLV75ZVuLaNJdPOiVDldO3Qmw5QYtcF_HZhXllCS4o',
       name: 'Marco Torres',
       title: 'Lead Developer',
       topic: 'itDoes! Interactive',
       time: '2:20 PM',
       description: 'Digital Doubles, Games, Film, and Advertisements. Your best friends in visual production',
       link: 'https://www.linkedin.com/in/marco-t-11839811a/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D5603AQEgSht9vxDF2w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724181257644?e=1736985600&v=beta&t=8b46Hg9K0sakcZS87sw0DHxNsIWVlF0271aAKovHBLI',
       name: 'David Chavera',
       title: 'Founder & Music Producer',
       topic: 'Artist Dev',
       time: '2:40 PM',
       description: 'Empower Independent Musicians to Grow their Careers Effectively and Monetize Quicker',
       link: 'https://www.linkedin.com/in/david-chavera/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D5603AQE8XcTEHeiG6A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1674942080932?e=1736985600&v=beta&t=WPjaeZ_-21lg46fOKGq-84kk3-_w0FzjNez0OC2-Cs4',
       name: 'Aiden Le',
       title: 'Founder of Documind',
       topic: 'Documind',
       time: '3:00 PM',
       description: 'Documind helps collectors manage their collections, get recommendations, and turn comics into audio stories.',
       link: 'https://www.linkedin.com/in/thien-le1/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/C4D0BAQH68oVI-sC8IA/company-logo_200_200/company-logo_200_200/0/1633327119642/smart_border_systems_logo?e=1739404800&v=beta&t=HqUje6DN1GZGsSj65ImhB2mldNYgM5YMFnj4Ti1cvYI',
       name: 'Eduardo Cabrera',
       title: 'Founder of Smart Border Systems',
       topic: 'Smart Border Systems',
       time: '3:20 PM',
       description: 'Revolutionizing border management, we reduce wait times and increase control at busy checkpoints with intelligent arrival systems and traffic management technology.',
       link: 'https://www.smartborder.systems/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D562DAQGzmb8ttQrl7A/profile-treasury-image-shrink_1920_1920/profile-treasury-image-shrink_1920_1920/0/1731198066520?e=1731963600&v=beta&t=CWwMLGzpUdWzirldmB4hEO16c1XhlUL4u6pszkba_vg',
       name: 'Sameer Siddiqui',
       title: 'Founder of Drone Washing Solutions',
       topic: 'Drone Washing Solutions',
       time: '3:40 PM',
       description: 'Commercial & residential exterior cleaning services using a state of the art wash drone',
       link: 'https://www.linkedin.com/in/sameer-siddiqui-597785252/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D560BAQFe2xXtaeX17Q/company-logo_200_200/company-logo_200_200/0/1727388209977/populaceapp_logo?e=1739404800&v=beta&t=lAdUnJSCuWEibpr4ltsud69Ked4eBvNCXvSAnbOzPGA',
       name: 'Michael Cervantes',
       title: 'Strategy & Innovation Architect',
       topic: 'Populace',
       time: '4:00 PM',
       description: 'Reclaim your financial power and profit from your wealth with Populace',
       link: 'https://www.populace.app/',
    },
    {
       img: 'https://maverickmri.com/wp-content/uploads/2023/01/maverick-og.png',
       name: 'Darian Padua & Abraham Padua',
       title: 'Co-founders of Maverick MRI',
       topic: 'Maverick MRI',
       time: '4:20 PM',
       description: 'Maverick MRI offers advanced 3-Tesla MRI imaging and AI-powered diagnostics for proactive healthcare.',
       link: 'https://maverickmri.com/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D560BAQHPiTInmG4hnw/company-logo_200_200/company-logo_200_200/0/1715175289668/soulmobility_logo?e=1739404800&v=beta&t=cUKSELjMAZ9V3OASFEzxtI2RV8EMBjow03UuZ3LV6Y0',
       name: 'Todd Hargroder',
       title: 'Founder of Soul Mobility',
       topic: 'Soul Mobility',
       time: '4:40 PM',
       description: 'Soul Mobility empowers wheelchair users with innovative mobility solutions designed by a C5/6 quadriplegic.',
       link: 'https://www.linkedin.com/company/soulmobility/',
    },
    {
       img: 'https://media.licdn.com/dms/image/v2/D5603AQGDi8SykfMsGA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1730783809762?e=1736985600&v=beta&t=bgUUHWiMydmyf0xzvW26VM4jcVrg2TU5nWf0awcbRFE',
       name: 'James Oleen',
       title: 'Founder of American Tenet',
       topic: 'American Tenet',
       time: '5:00 PM',
       description: 'Using Technology to Solve Global Issues',
       link: 'https://www.linkedin.com/in/jamesoleen/',
    },
 ];
 