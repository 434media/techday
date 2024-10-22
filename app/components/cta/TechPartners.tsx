import { Container } from '~/components/ui/Container'
import { FadeIn, FadeInStagger } from '~/components/ui/FadeIn'
import clsx from 'clsx'

export function TechPartners({
    className,
  }: React.ComponentPropsWithoutRef<'div'>) {
    return (
      <div
        className={clsx(
          className,
          'flex justify-between max-sm:mx-auto max-sm:max-w-md max-sm:flex-wrap max-sm:justify-evenly max-sm:gap-x-4 max-sm:gap-y-4',
        )}
      >
        <Container className='mt-16'>
          <FadeIn className="flex items-center gap-x-8">
            <h2 className="font-mono text-xs/5 font-semibold uppercase tracking-widest text-neutral-500">
                Tech Day 2024 Sponsors
            </h2>
            <div className="h-px flex-auto bg-neutral-200" />
          </FadeIn>
          <FadeInStagger faster>
            <ul role="list" className="mt-4 grid grid-cols-2 place-items-center gap-0.5 overflow-hidden sm:mx-0 md:grid-cols-5 md:place-items-start">
              {clients.sponsors.map(({ name, image, alt }) => (
                <li key={name} className="p-8 sm:p-10">
                  <FadeIn>
                    <img 
                        src={image} 
                        alt={alt}
                        className="max-h-12 w-full object-contain md:max-h-14"
                        />
                  </FadeIn>
                </li>
              ))}
            </ul>
            </FadeInStagger>
            <FadeIn className="flex items-center gap-x-8 mt-10 lg:mt-24">
            <h2 className="font-mono text-xs/5 font-semibold uppercase tracking-widest text-neutral-500">
                Tech Day 2024 Partners
            </h2>
            <div className="h-px flex-auto bg-neutral-200" />
          </FadeIn>
          <FadeInStagger faster>
            <ul role="list" className="mt-4 grid grid-cols-2 place-items-center gap-0.5 overflow-hidden sm:mx-0 md:grid-cols-5 md:place-items-start">
              {clients.partners.map(({ name, image, alt }) => (
                <li key={name} className="p-8 sm:p-10">
                  <FadeIn>
                    <img 
                      src={image} 
                      alt={alt} 
                      className="max-h-12 w-full object-contain md:max-h-14"
                    />
                  </FadeIn>
                </li>
              ))}
            </ul>
          </FadeInStagger>
        </Container>
      </div>
    );
  }

  const clients = {
    sponsors: [
      { name: 'AT&T', image: 'https://simpleicons.org/icons/atandt.svg', alt: 'AT&T' },
      { name: 'Bexar County Economic Development Department', image: 'https://www.bexar.org/ImageRepository/Document?documentId=19121', alt: 'Bexar County Economic Development Department' },
      { name: 'Rackspace', image: 'https://www.rackspace.com/sites/default/files/2024-06/option%20a.png', alt: 'Rackspace' },
      { name: 'MGV Capital Group', image: 'https://media.licdn.com/dms/image/v2/C4E0BAQEFHjzTrWlkeA/company-logo_200_200/company-logo_200_200/0/1630629517687/mgv_capital_group_logo?e=1737590400&v=beta&t=PirKmvqV_N5W7VuSic4fVNM0ckVoCcgZHVgKO2C7gek', alt: 'MGV Capital Group' },
      { name: 'Port San Antonio', image: 'https://www.portsanantonio.us/sites/default/files/topLogo.png', alt: 'Port San Antonio' },
      { name: 'JP Morgan Chase', image: 'https://www.jpmorganchase.com/content/dam/jpmorganchase/images/logos/jpmc-logo.svg', alt: 'JP Morgan Chase' },
      { name: 'MassChallenge', image: 'https://masschallenge.org/wp-content/uploads/2022/06/mc-logo@2x.png', alt: 'MassChallenge' },
    ],
    partners: [
      { name: 'IBM', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1729570609/hashing2_g4on33.svg', alt: 'IBM' },
      { name: 'KIPP', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1729606469/kipp_oao5ca.svg', alt: 'KIPP' },
      { name: 'Massive', image: 'https://cdn.prod.website-files.com/5eb4731c69fe0858908ee740/5f57d9ba54bfd7c23fd4f144_massive%20logo%402x.png', alt: 'Massive' },
      { name: 'AWS', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1729570946/amazonwebservices_juiivn.svg', alt: 'AWS' },
      { name: 'Dux Capital', image: 'https://media.licdn.com/dms/image/v2/C4E0BAQG2Ky4Ql03whA/company-logo_200_200/company-logo_200_200/0/1674223925710/duxcapital_logo?e=1737590400&v=beta&t=r9HtAfLKQS8Mq0jE6wuucPJ57R3wi0ecZ_Z6764bXfQ', alt: 'Dux Capital' },
      { name: 'Google', image: 'https://res.cloudinary.com/jessebubble/image/upload/v1729570438/google_rp9nql.svg', alt: 'Google' },
      { name: 'Prime Example', image: 'https://theprimeexample.org/wp-content/uploads/2023/10/logo.png', alt: 'Prime Example' },
    ],
  };