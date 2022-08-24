import { FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';
import React from 'react';
import ParsedPlayer from '../../lib/classes/ParsedPlayer';
import ServerList from '../ServerList/ServerList';
import { AnimatePresence, motion } from 'framer-motion';
import Viewer from '../Viewer/Viewer';

const ServerCard = ({
	name,
	uuid,
	servers,
	mojangName,
	skin,
}: ParsedPlayer) => {
	const [showServers, setShowServers] = useState(false);
	const isAuthorized = !!mojangName;

	return (
		<ul className='p-5 ring-1 ring-neutral-500 bg-neutral-800 mb-4 break-words rounded-lg leading-7 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-around'>
			<div id='skin-viewer' className='lg:self-start'>
				<Viewer skin={skin} />
			</div>
			<div>
				<hr className=' border-t-neutral-500 rounded-full mb-4 block lg:rotate-90'></hr>
			</div>
			<div id='details'>
				<li>
					<span className='text-neutral-400'>Name: </span>
					<span>{name}</span>
				</li>
				{isAuthorized && name !== mojangName && (
					<li>
						<span className='text-neutral-400'>Mojang name: </span>
						<span>{mojangName}</span>
					</li>
				)}

				<li>
					<span className='text-neutral-400'>UUID: </span>
					<span>{uuid}</span>
				</li>
				{/* If either skinURL or modelType are undefined show that player is not authorized */}
				{isAuthorized ? null : (
					<small className='italic'>Player not authorized by Mojang</small>
				)}
				<li>
					<div
						onClick={() => setShowServers((prev) => !prev)}
						className='cursor-pointer flex flex-row items-center gap-2'
					>
						<span>{showServers ? 'Hide' : 'Show'} servers</span>
						<motion.div
							id='dropdown-button'
							animate={{ rotate: showServers ? '-180deg' : '0deg' }}
							className='active:bg-neutral-600 hover:bg-neutral-600 w-fit h-fit p-[0.1rem] rounded-full transition-colors'
						>
							<FiChevronDown size='18px' />
						</motion.div>
					</div>
				</li>

				<li>
					<AnimatePresence>
						{showServers ? <ServerList servers={servers} /> : null}
					</AnimatePresence>
				</li>
			</div>
		</ul>
	);
};

export default React.memo(ServerCard);
