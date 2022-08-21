import { z } from 'zod';
import SearchList from '../SearchList/SearchList';
import { BiArrowBack } from 'react-icons/bi';
import { useRouter } from 'next/router';

export type SearchQuery = {
	ip?: string | undefined | null;
	keyword?: string | undefined | null;
};

const SearchPage = ({ query }: { query: SearchQuery }) => {
	const router = useRouter();
	const searchSchema = z.object({
		ip: z.string().nullish(),
		keyword: z.string().trim().nullish(),
	});
	const res = searchSchema.parse(query);

	return (
		<div className='p-4 md:max-w-[750px] xl:max-w-[990px] mx-auto'>
			<div
				onClick={() => router.back()}
				className='cursor-pointer w-fit h-fit mb-4 p-1 rounded-full hover:bg-neutral-700 transition-colors'
			>
				<BiArrowBack size={28} />
			</div>
			<SearchList query={res} />
		</div>
	);
};

export default SearchPage;
