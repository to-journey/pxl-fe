import { Avatar, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import _ from 'lodash';
import { useContext, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useGetGames } from '../api/games';
import { useGetScoreboard } from '../api/scoreboard';
import { useGetUsers } from '../api/users';
import UserProfileModal from '../components/UserProfileModal';
import { IGame, IScore, IUser } from '../interfaces';
import { AuthContext } from '../providers/AuthProvider';

const dayOfWeeks = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const Scoreboard = () => {
    const [params] = useSearchParams();
    const { user } = useContext(AuthContext);
    const view = params.get('view');
    const { users } = useGetUsers();
    const { games } = useGetGames();
    const { scores } = useGetScoreboard();
    const [selectedUserId, setSelectedUserId] = useState<number>();
    const [showUserProfileModal, setShowUserProfileModal] = useState(false);

    const getScores = (scores: IScore[]) => {
        const total = scores?.reduce((prev, userScore) => prev + Number(userScore.score), 0);
        return {
            total,
            games: games.map((game: IGame) => _.find(scores, (score => score.game_id == game.id))?.score)
        };
    }

    const usersWithScore = useMemo(() => {
        if (view) {
            const weekly = _.groupBy(scores.weekly, (score => score.user_id));
            const daily = Array.from({ length: 7 }, (_v, index) => _.groupBy(scores.daily?.[index], (score => score.user_id)));
            const total = _.groupBy(scores.total, (score => score.user_id));

            const result = _.map(users, (user: IUser) => {
                return { ...user, weekly: [getScores(weekly[user.id])], daily: daily.map(scores => getScores(scores[user.id])), total: [getScores(total[user.id])] };
            });

            const sortedResult = result.sort((a: any, b: any) => {
                return (b[view][0].total || 0) - (a[view][0].total || 0);
            });

            return sortedResult.map((user, index) => ({ ...user, rank: index + 1 }));
        }
        return [];
    }, [users, games, scores, view]);

    return (
        <>
            <Flex p={{ base: '16px', lg: '96px' }} justify='center'>
                <Flex w='full' maxW='1280px'>
                    <TableContainer w='full' bg='black' border='2px solid purple' rounded='16px'>
                        <Table>
                            <Thead borderBottom='2px solid purple'>
                                <Tr>
                                    <Th w='240px' fontFamily='Pixeled' pl={8}>
                                        RANK
                                    </Th>
                                    <Th fontFamily='Pixeled'>
                                        PROFILE
                                    </Th>
                                    {view == 'daily' ? dayOfWeeks.map((dayOfWeek: string, index: number) => (
                                        <Th key={index} fontFamily='Pixeled'>
                                            {dayOfWeek}
                                        </Th>
                                    )) : (
                                        <Th fontFamily='Pixeled'>
                                            TOTAL
                                        </Th>
                                    )}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {[
                                    ...usersWithScore.filter((userWithScore, index) => index > 20 && userWithScore.id == user?.id),
                                    ...usersWithScore.filter((userWithScore, index) => index < 20 || userWithScore.id != user?.id)
                                ].map((userWithScore: any, i: number) => {
                                    if (view) {
                                        return (
                                            <Tr key={i} onClick={() => {
                                                if (!user?.is_admin) return;
                                                setSelectedUserId(userWithScore.id);
                                                setShowUserProfileModal(true);
                                            }}>
                                                <Td fontSize={12} p={0}>
                                                    <Flex position='relative' pl={8} h='65px' align='center' {...(userWithScore.id == user?.id && { bgGradient: 'linear(to-b, #fc02d880, #0000 20%, #0000 80%, #fc02d880)' })}>
                                                        {userWithScore.rank}
                                                    </Flex>
                                                </Td>
                                                <Td py='8px' p={0}>
                                                    <Flex p={4} h='65px' align='center' gap='8px' {...(userWithScore.id == user?.id && { bgGradient: 'linear(to-b, #fc02d880, #0000 20%, #0000 80%, #fc02d880)' })}>
                                                        <Avatar src={`${import.meta.env.VITE_API_URL}/public/${userWithScore.avatar}`} />
                                                        <Flex direction='column' justify='center' gap='8px'>
                                                            <Text fontSize={12}>{userWithScore.username}</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Td>
                                                {userWithScore[view]?.map((score: any, j: number) => (
                                                    <Td key={j} fontSize={12} p={0}>
                                                        <Flex position='relative' p={4} h='65px' align='center' {...(userWithScore.id == user?.id && { bgGradient: 'linear(to-b, #fc02d880, #0000 20%, #0000 80%, #fc02d880)' })}>
                                                            {view == 'daily' ? (
                                                                <Flex gap='4px'>
                                                                    {score.total || 0}:
                                                                    {score.games.map((game: any, k: number) => (
                                                                        <Flex key={k}>
                                                                            <Text color='red.500'>{k + 1}</Text>
                                                                            <Text>={game || 0}</Text>
                                                                        </Flex>
                                                                    ))}
                                                                </Flex>
                                                            ) : (
                                                                <>{score.total || 0}</>
                                                            )}
                                                        </Flex>
                                                    </Td>
                                                ))}
                                            </Tr>
                                        )
                                    }
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>
            </Flex>
            <UserProfileModal isOpen={showUserProfileModal} onClose={() => setShowUserProfileModal(false)} userId={selectedUserId} />
        </>
    )
}

export default Scoreboard;
