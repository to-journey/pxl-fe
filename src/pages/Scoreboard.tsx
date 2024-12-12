import { Avatar, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import _ from 'lodash';
import { useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useGetGames } from '../api/games';
import { useGetScoreboard } from '../api/scoreboard';
import { useGetUsers } from '../api/users';
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

    const getScores = (scores: IScore[]) => {
        const total = scores?.reduce((prev, userScore) => prev + Number(userScore.score), 0);
        return {
            total,
            games: games.map((game: IGame) => _.find(scores, (score => score.game_id == game.id))?.score).join('/')
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

            return result.sort((a: any, b: any) => {
                return (b[view][0].total || 0) - (a[view][0].total || 0);
            });
        }
        return [];
    }, [users, games, scores, view]);

    return (
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
                                ...usersWithScore.filter((userWithScore) => userWithScore.id == user?.id),
                                ...usersWithScore.filter((userWithScore) => userWithScore.id != user?.id)
                            ].map((userWithScore: any, index: number) => {
                                if (view) {
                                    console.log(userWithScore);
                                    return (
                                        <Tr key={index} {...(userWithScore.id == user?.id ? { shadow: 'inset 0 0 12px #fc02d8' } : {})}>
                                            <Td fontSize={12} pl={8}>
                                                {index + 1}
                                            </Td>
                                            <Td py='8px'>
                                                <Flex gap='8px'>
                                                    <Avatar src={`${import.meta.env.VITE_API_URL}/public/${userWithScore.avatar}`} />
                                                    <Flex direction='column' justify='center' gap='8px'>
                                                        <Text fontSize={12}>{userWithScore.name}</Text>
                                                    </Flex>
                                                </Flex>
                                            </Td>
                                            {userWithScore[view]?.map((score: any) => (
                                                <Td fontSize={12}>
                                                    {view == 'daily' ? <>{score.total}: {score.games}</> : score.total}
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
    )
}

export default Scoreboard;
