/**
 * Modal that displays information about the application.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { forwardRef, useImperativeHandle, useState } from 'react';

import {
  Link,
  Modal,
  ModalBody,
  ModalContent,
  Skeleton,
  useDisclosure,
} from '@nextui-org/react';
import Image from 'next/image';

export interface AboutRef {
  openModal: () => void;
}

const About = forwardRef<AboutRef>((props, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      placement="center"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
    >
      <ModalContent>
        <ModalBody className="my-3 *:text-center *:text-textBlack">
          <div className="flex flex-col items-center gap-y-2">
            <Skeleton isLoaded={isLoaded} className="rounded-full">
              <Image
                src="/icon/icon.png"
                alt="logo"
                width={100}
                height={100}
                onLoad={() => setIsLoaded(true)}
              />
            </Skeleton>
            <div className="flex flex-col items-center">
              <h1 className="text-xl font-bold">Map File Preparation Application (MFPA)</h1>
              <p>Version 4.0.0</p>
            </div>
            <div className="flex flex-col items-center">
              <h2>
                Developed by{' '}
                <span className="font-semibold">UofG - SH21 Team</span>
              </h2>
              <h3 className="whitespace-pre-line text-sm">
                As part of COMPSCI 4047 Team Project (H) course {'\n'} at the
                University of Glasgow
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <Link
                href="https://sh21-x-thales-uk.gitbook.io/docs/"
                isExternal
                showAnchorIcon
                underline="hover"
                className="font-bold text-textBlack"
              >
                Help & Documentation
              </Link>
              <Link
                href="https://github.com/tuckers1967/MFPA"
                isExternal
                showAnchorIcon
                underline="hover"
                className="font-bold text-textBlack"
              >
                GitHub
              </Link>
              <h2 className="text-sm">
                Contact (Dulapah):{' '}
                <span className="select-all">2920990V@student.gla.ac.uk</span>
              </h2>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="font-bold">Team Members</h2>
              <ul className="flex flex-col items-center *:text-sm">
                <li>Dulapah Vibulsanti | (Scrum Master, Frontend Developer)</li>
                <li>Mahnun Saratunti | (Product Owner, Frontend Developer)</li>
                <li>Bin Zhang | (Backend Developer, Documentation)</li>
                <li>Luowan Xu | (Backend Developer, Documentation)</li>
                <li>Reuben Spivey | (Backend Developer, Note Taker)</li>
                <li>Zofia Bochenek | (Backend Developer)</li>
              </ul>
            </div>
            <h3 className="text-sm font-medium">
              This project is licensed under the{' '}
              <Link
                href="https://github.com/tuckers1967/MFPA/blob/main/LICENSE"
                isExternal
                showAnchorIcon
                underline="hover"
                className="text-sm font-medium text-textBlack"
              >
                MIT License
              </Link>
            </h3>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

About.displayName = 'About';

export default About;
