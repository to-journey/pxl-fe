import { Avatar, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import _ from 'lodash';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useGetGames } from '../api/games';
import { useGetScoreboard } from '../api/scoreboard';
import { useGetUsers } from '../api/users';
import { IUser } from '../interfaces';

const Scoreboard = () => {
    const [params] = useSearchParams();
    const view = params.get('view');
    const { users } = useGetUsers();
    const { games } = useGetGames();
    const { scores } = useGetScoreboard();

    const usersWithScore = useMemo(() => {
        const userScores = _.groupBy(view ? scores[view] : null, (score) => score.user_id);
        const result = _.map(users, (user: IUser) => {
            const totalScore = userScores[user.id]?.reduce((prev, userScore) => prev + Number(userScore.score), 0);
            return { ...user, totalScore };
        });
        return result.sort((a: any, b: any) => {
            return b.totalScore - a.totalScore;
        });
    }, [users, games, scores]);

    return (
        <Flex p={{ base: '16px', lg: '96px' }} justify='center'>
            <Flex w='full' maxW='1440px'>
                <TableContainer w='full' bg='black' border='2px solid purple' rounded='16px'>
                    <Table>
                        <Thead borderBottom='2px solid purple'>
                            <Tr>
                                <Th fontFamily='Pixeled'>
                                    RANK
                                </Th>
                                <Th fontFamily='Pixeled'>
                                    PROFILE
                                </Th>
                                <Th fontFamily='Pixeled'>
                                    TOTAL
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {usersWithScore.map((user: any, index: number) => {
                                return (
                                    <Tr key={index}>
                                        <Td fontSize={12}>
                                            {index + 1}
                                        </Td>
                                        <Td>
                                            <Flex gap='8px'>
                                                <Avatar src={`${import.meta.env.VITE_API_URL}/public/${user.avatar}`} />
                                                <Flex direction='column' justify='center' gap='8px'>
                                                    <Text fontSize={12}>{user.name}</Text>
                                                </Flex>
                                            </Flex>
                                        </Td>
                                        <Td fontSize={12}>
                                            {user.totalScore}
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </Flex>
    )
}

export default Scoreboard;
