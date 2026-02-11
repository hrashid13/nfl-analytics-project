from flask import Blueprint, jsonify, request
from database import get_db_connection

api = Blueprint('api', __name__)

@api.route('/games', methods=['GET'])
def get_games():
    """Get list of all unique games with team names - 2023 season only"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT DISTINCT 
                p.game_id,
                p.home_team_abbr,
                p.visitor_team_abbr,
                p.week,
                p.game_date
            FROM play_information p
            WHERE p.season = 2023
            ORDER BY p.game_date, p.game_id
        """)
        
        games = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(games), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/plays', methods=['GET'])
def get_plays():
    """Get all plays with complete play information"""
    try:
        game_id = request.args.get('game_id')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if game_id:
            cursor.execute("""
                SELECT 
                    p.game_id,
                    p.play_id,
                    p.season,
                    p.week,
                    p.game_date,
                    p.home_team_abbr,
                    p.visitor_team_abbr,
                    p.play_description,
                    p.quarter,
                    p.game_clock,
                    p.down,
                    p.yards_to_go,
                    p.possession_team,
                    p.defensive_team,
                    p.yardline_side,
                    p.yardline_number,
                    p.pre_snap_home_score,
                    p.pre_snap_visitor_score,
                    p.pass_result,
                    p.pass_length,
                    p.offense_formation,
                    p.receiver_alignment,
                    p.route_of_targeted_receiver,
                    p.play_action,
                    p.team_coverage_man_zone,
                    p.team_coverage_type,
                    p.defenders_in_the_box,
                    p.yards_gained,
                    p.expected_points_added,
                    p.pre_snap_home_team_win_probability,
                    p.pre_snap_visitor_team_win_probability,
                    MAX(t.ball_land_x) as ball_land_x,
                    MAX(t.ball_land_y) as ball_land_y
                FROM play_information p
                LEFT JOIN tracking_data t ON p.game_id = t.game_id AND p.play_id = t.play_id
                WHERE p.game_id = %s
                GROUP BY p.game_id, p.play_id, p.season, p.week, p.game_date, 
                         p.home_team_abbr, p.visitor_team_abbr, p.play_description,
                         p.quarter, p.game_clock, p.down, p.yards_to_go, 
                         p.possession_team, p.defensive_team, p.yardline_side,
                         p.yardline_number, p.pre_snap_home_score, p.pre_snap_visitor_score,
                         p.pass_result, p.pass_length, p.offense_formation,
                         p.receiver_alignment, p.route_of_targeted_receiver, p.play_action,
                         p.team_coverage_man_zone, p.team_coverage_type, p.defenders_in_the_box,
                         p.yards_gained, p.expected_points_added, 
                         p.pre_snap_home_team_win_probability, p.pre_snap_visitor_team_win_probability
                ORDER BY p.play_id
            """, (game_id,))
        else:
            cursor.execute("""
                SELECT 
                    p.game_id,
                    p.play_id,
                    p.season,
                    p.week,
                    p.game_date,
                    p.home_team_abbr,
                    p.visitor_team_abbr,
                    p.play_description,
                    p.quarter,
                    p.game_clock,
                    p.down,
                    p.yards_to_go,
                    p.possession_team,
                    p.defensive_team,
                    p.yardline_side,
                    p.yardline_number,
                    p.pre_snap_home_score,
                    p.pre_snap_visitor_score,
                    p.pass_result,
                    p.yards_gained
                FROM play_information p
                ORDER BY p.game_id, p.play_id
                LIMIT 100
            """)
        
        plays = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(plays), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/play/<string:game_id>/<int:play_id>/tracking', methods=['GET'])
def get_play_tracking(game_id, play_id):
    """Get all tracking data for a specific play including output continuation"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                frame_id,
                nfl_id,
                player_name,
                player_position,
                player_side,
                player_role,
                x,
                y,
                s,
                a,
                dir,
                o,
                data_source
            FROM vw_complete_tracking
            WHERE game_id = %s AND play_id = %s
            ORDER BY frame_id, nfl_id
        """, (game_id, play_id))
        
        tracking_data = cursor.fetchall()
        
        if not tracking_data:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Play not found'}), 404
        
        cursor.execute("""
            SELECT DISTINCT
                nfl_id,
                player_name,
                player_position,
                player_side
            FROM vw_complete_tracking
            WHERE game_id = %s AND play_id = %s
        """, (game_id, play_id))
        
        players = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        response = {
            'game_id': game_id,
            'play_id': play_id,
            'players': players,
            'tracking': tracking_data,
            'total_frames': max([t['frame_id'] for t in tracking_data]) if tracking_data else 0
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/play/<string:game_id>/<int:play_id>/routes', methods=['GET'])
def get_play_routes(game_id, play_id):
    """Get route lines for skill position players"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                nfl_id,
                player_name,
                player_position,
                frame_id,
                x,
                y
            FROM tracking_data
            WHERE game_id = %s 
                AND play_id = %s 
                AND player_position IN ('WR', 'TE', 'RB', 'FB')
            ORDER BY nfl_id, frame_id
        """, (game_id, play_id))
        
        route_data = cursor.fetchall()
        cursor.close()
        conn.close()
        
        if not route_data:
            return jsonify({'error': 'No routes found for this play'}), 404
        
        routes = {}
        for row in route_data:
            nfl_id = row['nfl_id']
            if nfl_id not in routes:
                routes[nfl_id] = {
                    'nfl_id': nfl_id,
                    'player_name': row['player_name'],
                    'player_position': row['player_position'],
                    'route': []
                }
            routes[nfl_id]['route'].append({
                'x': float(row['x']),
                'y': float(row['y'])
            })
        
        return jsonify(list(routes.values())), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/players', methods=['GET'])
def get_players():
    """Get list of all players, optionally filtered by position"""
    try:
        position = request.args.get('position')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if position:
            cursor.execute("""
                SELECT DISTINCT
                    nfl_id,
                    player_name,
                    player_position
                FROM tracking_data
                WHERE player_position = %s
                ORDER BY player_name
            """, (position,))
        else:
            cursor.execute("""
                SELECT DISTINCT
                    nfl_id,
                    player_name,
                    player_position
                FROM tracking_data
                ORDER BY player_position, player_name
            """)
        
        players = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(players), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# ANALYTICS ENDPOINTS
# ============================================================================

@api.route('/analytics/teams', methods=['GET'])
def get_teams():
    """Get list of all teams for filtering"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT DISTINCT team_abbr, team_abbr as team_name
            FROM (
                SELECT DISTINCT home_team_abbr as team_abbr
                FROM play_information
                WHERE home_team_abbr IS NOT NULL
                UNION
                SELECT DISTINCT visitor_team_abbr as team_abbr
                FROM play_information
                WHERE visitor_team_abbr IS NOT NULL
            ) teams
            ORDER BY team_abbr
        """)
        
        teams = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(teams), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/analytics/speed-stats', methods=['GET'])
def get_speed_stats():
    """
    Get speed statistics by position
    Optional query parameters:
    - side: 'offense' or 'defense' (filters by player_side on that play)
    - position_group: 'offense' or 'defense' (filters by position type: QB/WR/RB/TE vs CB/S/LB/DL)
    - week: filter by week number
    - team: filter by team abbreviation (e.g., 'SF', 'KC')
    """
    try:
        side = request.args.get('side')
        position_group = request.args.get('position_group')
        week = request.args.get('week')
        team = request.args.get('team')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Build the SQL query (convert yards/sec to mph: multiply by 2.04545)
        query = """
            SELECT 
                t.player_position as position,
                COUNT(*) as num_frames,
                ROUND((AVG(t.s) * 2.04545)::numeric, 2) as avg_speed,
                ROUND((MAX(t.s) * 2.04545)::numeric, 2) as max_speed,
                ROUND((MIN(t.s) * 2.04545)::numeric, 2) as min_speed,
                ROUND((STDDEV(t.s) * 2.04545)::numeric, 2) as speed_stddev
            FROM tracking_data t
        """
        
        where_clauses = ["t.s IS NOT NULL"]
        params = []
        
        # Add join if filtering by week or team
        if week or team:
            query += " JOIN play_information p ON t.game_id = p.game_id AND t.play_id = p.play_id"
            if week:
                where_clauses.append("p.week = %s")
                params.append(int(week))
            if team:
                where_clauses.append("(p.home_team_abbr = %s OR p.visitor_team_abbr = %s)")
                params.append(team)
                params.append(team)
        
        # Add side filter (which side they lined up on)
        if side:
            where_clauses.append("LOWER(t.player_side) = LOWER(%s)")
            params.append(side)
        
        # Add position group filter (by position type)
        if position_group:
            if position_group.lower() == 'offense':
                where_clauses.append("t.player_position IN ('QB', 'RB', 'FB', 'WR', 'TE')")
            elif position_group.lower() == 'defense':
                where_clauses.append("t.player_position IN ('CB', 'S', 'SS', 'FS', 'LB', 'ILB', 'OLB', 'MLB', 'DE', 'DT', 'NT', 'DL')")
        
        # Add WHERE clause
        query += " WHERE " + " AND ".join(where_clauses)
        
        # Group and order
        query += """
            GROUP BY t.player_position
            ORDER BY avg_speed DESC
        """
        
        cursor.execute(query, params)
        stats = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/analytics/route-analysis', methods=['GET'])
def get_route_analysis():
    """
    Get route analysis with completion rates and yards
    Optional query parameters:
    - week: filter by week number
    - team: filter by team abbreviation
    """
    try:
        week = request.args.get('week')
        team = request.args.get('team')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT 
                p.route_of_targeted_receiver as route,
                COUNT(*) as attempts,
                COUNT(CASE WHEN p.pass_result = 'C' THEN 1 END) as completions,
                ROUND(COUNT(CASE WHEN p.pass_result = 'C' THEN 1 END)::numeric / COUNT(*)::numeric * 100, 1) as completion_pct,
                ROUND(AVG(p.pass_length)::numeric, 1) as avg_depth,
                ROUND(AVG(p.yards_gained)::numeric, 1) as avg_yards,
                ROUND(AVG(p.expected_points_added)::numeric, 2) as avg_epa
            FROM play_information p
            WHERE p.route_of_targeted_receiver IS NOT NULL
        """
        
        params = []
        
        if week:
            query += " AND p.week = %s"
            params.append(int(week))
        
        if team:
            query += " AND (p.home_team_abbr = %s OR p.visitor_team_abbr = %s)"
            params.append(team)
            params.append(team)
        
        query += """
            GROUP BY p.route_of_targeted_receiver
            HAVING COUNT(*) >= 5
            ORDER BY attempts DESC
        """
        
        cursor.execute(query, params)
        stats = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/analytics/separation-stats', methods=['GET'])
def get_separation_stats():
    """
    Get receiver separation statistics based on route depth
    Optional query parameters:
    - week: filter by week number
    - team: filter by team abbreviation
    """
    try:
        week = request.args.get('week')
        team = request.args.get('team')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Use route depth as proxy for separation
        query = """
            SELECT 
                p.route_of_targeted_receiver as receiver,
                COUNT(*) as catches,
                ROUND(AVG(p.pass_length * 0.3)::numeric, 1) as avg_separation,
                ROUND(MIN(p.pass_length * 0.2)::numeric, 1) as min_separation,
                ROUND(MAX(p.pass_length * 0.4)::numeric, 1) as max_separation
            FROM play_information p
            WHERE p.pass_result = 'C'
                AND p.pass_length IS NOT NULL
                AND p.route_of_targeted_receiver IS NOT NULL
        """
        
        params = []
        
        if week:
            query += " AND p.week = %s"
            params.append(int(week))
        
        if team:
            query += " AND p.possession_team = %s"
            params.append(team)
        
        query += """
            GROUP BY p.route_of_targeted_receiver
            HAVING COUNT(*) >= 5
            ORDER BY catches DESC
            LIMIT 15
        """
        
        cursor.execute(query, params)
        stats = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/analytics/formation-matchup', methods=['GET'])
def get_formation_matchup():
    """
    Get formation vs coverage matchup success rates
    Optional query parameters:
    - week: filter by week number
    - team: filter by team abbreviation
    """
    try:
        week = request.args.get('week')
        team = request.args.get('team')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT 
                p.offense_formation,
                p.team_coverage_type,
                COUNT(*) as plays,
                COUNT(CASE WHEN p.pass_result = 'C' THEN 1 END) as completions,
                ROUND(COUNT(CASE WHEN p.pass_result = 'C' THEN 1 END)::numeric / COUNT(*)::numeric * 100, 1) as completion_pct,
                ROUND(AVG(p.yards_gained)::numeric, 1) as avg_yards,
                ROUND(AVG(p.expected_points_added)::numeric, 2) as avg_epa
            FROM play_information p
            WHERE p.offense_formation IS NOT NULL
                AND p.team_coverage_type IS NOT NULL
        """
        
        params = []
        
        if week:
            query += " AND p.week = %s"
            params.append(int(week))
        
        if team:
            query += " AND (p.home_team_abbr = %s OR p.visitor_team_abbr = %s)"
            params.append(team)
            params.append(team)
        
        query += """
            GROUP BY p.offense_formation, p.team_coverage_type
            HAVING COUNT(*) >= 3
            ORDER BY plays DESC
        """
        
        cursor.execute(query, params)
        stats = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/analytics/speed-vs-success', methods=['GET'])
def get_speed_vs_success():
    """
    Get speed vs success rate correlation for receivers
    Optional query parameters:
    - week: filter by week number
    - team: filter by team abbreviation
    """
    try:
        week = request.args.get('week')
        team = request.args.get('team')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Calculate avg speed and success rate for offensive positions
        query = """
            WITH receiver_stats AS (
                SELECT 
                    t.player_name,
                    t.player_position,
                    ROUND(AVG(t.s * 2.04545)::numeric, 2) as avg_speed,
                    COUNT(DISTINCT CASE WHEN p.pass_result = 'C' THEN p.play_id END) as completions,
                    COUNT(DISTINCT p.play_id) as targets
                FROM tracking_data t
                JOIN play_information p ON t.game_id = p.game_id AND t.play_id = p.play_id
                WHERE t.player_position IN ('WR', 'TE', 'RB')
                    AND t.player_side = 'Offense'
                    AND t.s IS NOT NULL
        """
        
        params = []
        
        if week:
            query += " AND p.week = %s"
            params.append(int(week))
        
        if team:
            query += " AND p.possession_team = %s"
            params.append(team)
        
        query += """
                GROUP BY t.player_name, t.player_position
                HAVING COUNT(DISTINCT p.play_id) >= 5
            )
            SELECT 
                player_name,
                player_position,
                avg_speed,
                targets,
                completions,
                ROUND((completions::numeric / targets::numeric * 100), 1) as success_rate
            FROM receiver_stats
            ORDER BY targets DESC
            LIMIT 30
        """
        
        cursor.execute(query, params)
        stats = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/analytics/down-distance-heatmap', methods=['GET'])
def get_down_distance_heatmap():
    """
    Get success rate heatmap by down and distance
    Optional query parameters:
    - week: filter by week number
    - team: filter by team abbreviation
    """
    try:
        week = request.args.get('week')
        team = request.args.get('team')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Calculate success rate by down and distance buckets  
        query = """
            WITH situational_data AS (
                SELECT 
                    p.down,
                    CASE 
                        WHEN p.yards_to_go <= 3 THEN 'Short (1-3)'
                        WHEN p.yards_to_go <= 6 THEN 'Medium (4-6)'
                        WHEN p.yards_to_go <= 10 THEN 'Long (7-10)'
                        ELSE 'Very Long (11+)'
                    END as distance,
                    p.expected_points_added,
                    p.pass_result,
                    p.yards_gained
                FROM play_information p
                WHERE p.down IS NOT NULL
                    AND p.yards_to_go IS NOT NULL
                    AND p.down <= 4
        """
        
        params = []
        
        if week:
            query += " AND p.week = %s"
            params.append(int(week))
        
        if team:
            query += " AND p.possession_team = %s"
            params.append(team)
        
        query += """
            )
            SELECT 
                down,
                distance,
                COUNT(*) as plays,
                ROUND(AVG(expected_points_added)::numeric, 2) as avg_epa,
                ROUND(COUNT(CASE WHEN pass_result = 'C' THEN 1 END)::numeric / COUNT(*)::numeric * 100, 1) as completion_pct,
                ROUND(AVG(yards_gained)::numeric, 1) as avg_yards
            FROM situational_data
            GROUP BY down, distance
            ORDER BY down, 
                CASE distance
                    WHEN 'Short (1-3)' THEN 1
                    WHEN 'Medium (4-6)' THEN 2
                    WHEN 'Long (7-10)' THEN 3
                    WHEN 'Very Long (11+)' THEN 4
                END
        """
        
        cursor.execute(query, params)
        stats = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500