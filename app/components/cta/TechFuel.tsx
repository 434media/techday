import { Container } from '~/components/ui/Container';
import { FadeIn } from '~/components/ui/FadeIn';

export function TechFuel() {
   return (
      <div className="mt-24 sm:mt-32 lg:mt-40 pb-16 lg:pb-32">
         <Container className="">
            <FadeIn>
               <h2 className="font-mono text-xs/5 font-semibold uppercase tracking-widest text-neutral-500">
                  Tech Fuel 2024 | $100K Pitch Competition
               </h2>
               <h3 className="mt-2 max-w-3xl text-pretty text-4xl font-medium tracking-tighter text-neutral-950 data-[dark]:text-white sm:text-6xl">
                  Empowering San Antonio Startups for Global Success
               </h3>
               <div className="rounded-2xl mt-16">
                  <iframe
                     src="https://lu.ma/embed/event/evt-774BA3AnsRuaDTm/simple"
                     title="DevSA Upcoming Event Calendar"
                     style={{
                        borderRadius: '12px',
                        width: '100%',
                        height: '600px',
                     }}
                     className=""
                     allowFullScreen={true}
                     aria-hidden="false"
                     tabIndex={0}
                  ></iframe>
               </div>
            </FadeIn>
         </Container>
      </div>
   );
}