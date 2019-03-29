<?php

header("Access-Control-Allow-Origin: *");
/* 
this file is the endpoint that the client will reach when they submit their project details provided by the user

        if the titles are not found in the database then we make a call the the api The Movie Database to retrieve the information about the films
            then we send out an  INSERT query that will store the information into comparables table
            but also prepare the data to be sent out to the client 

*/


require_once('../../config/setup.php');
require_once('../../config/mysqlconnect.php');
require_once('../../config/tmdbcredentials.php');

$output = [
    'success'=>false
];



foreach($_GET AS $key=>$value){
    $_GET[$key]=addslashes($value);
}

$bodyVars = ['title1'=>$_GET['title1'],'title2'=>$_GET['title2']]; 

if(!$bodyVars){
    exit(500);
}

if( intval($bodyVars['title1'])!==0 || intval($bodyVars['title2'])!==0){
    throw new Exception('Can not have an integer as a movie title...for now.');
}

if($bodyVars['title1']==='' || $bodyVars['title2']===''){
    throw new Exception('Missing film title');
}

if($bodyVars['title1'] === $bodyVars['title2']){
    throw new Exception('The comparables are the same. Choose two different films!');
}

if(strlen($bodyVars['title1']) >100 || strlen($bodyVars['title2'])>100){
    throw new Exception('The name of the comparables films are too long. Choose others.');
}


$queryTitle=' ';
$title='';

if($bodyVars){
    foreach ($bodyVars as $key => $value) {
        $queryTitle.='c.`title`= "'.$value.'"';
        if($key === 'title1'){
            $queryTitle.=' OR ';
        }
    }
} else {
    exit(500);
}

$id_query = 'SELECT c.`id`, c.`title`
                FROM `comparables` AS c
                WHERE '.$queryTitle.'';

$id_result=$db->query($id_query);
$id_array=[];

while($row_id=$id_result->fetch_assoc()){
    $id_array[]=$row_id['id'];
    $incoming_title[]=$row_id['title'];
}

if($id_result -> num_rows === 1){
    if($incoming_title[0] == $bodyVars['title1']){
        $movies_url = 'https://api.themoviedb.org/3/search/movie?api_key='.urlencode($movie_key).'&query='.urlencode($bodyVars['title2']);
    } else {
        $movies_url = 'https://api.themoviedb.org/3/search/movie?api_key='.urlencode($movie_key).'&query='.urlencode($bodyVars['title1']);
    }
    $movies_title = file_get_contents($movies_url);
    $movies_title_data = json_decode($movies_title, true);
    if($movies_title_data['results'][0]['title'] === $bodyVars['title1'] || $movies_title_data['results'][0]['title'] === $bodyVars['title2']){
        $movies_id = 'https://api.themoviedb.org/3/movie/'.intval($movies_title_data['results'][0]['id']).'?api_key='.urlencode($movie_key);
        $movies_mpaa_rating = 'https://api.themoviedb.org/3/movie/'.intval($movies_title_data['results'][0]['id']).'/release_dates?api_key='.urlencode($movie_key);
        $movies_detail = file_get_contents($movies_id);
        $movies_mpaa_detail = file_get_contents($movies_mpaa_rating);
        $movies_detail_data = json_decode($movies_detail, true);
        $movies_mpaa_data = json_decode($movies_mpaa_detail, true);
        $mpaa_certification='';
        if(count($movies_mpaa_data['results'])>0){
            for($mpaaindex=0;$mpaaindex<count($movies_mpaa_data['results']);$mpaaindex++){
                if($movies_mpaa_data['results'][$mpaaindex]['iso_3166_1'] === 'US'){
                    $mpaa_certification = $movies_mpaa_data['results'][$mpaaindex]['release_dates'][0]['certification'];
                }
            }
        }

        $insert_us_gross_bo = floor($movies_detail_data["revenue"]*.6);
        $insert_intl_gross_bo = floor($movies_detail_data["revenue"]*.4);
        $insert_audience_satisfaction = $movies_detail_data["vote_average"]/10;
        $Date = $movies_detail_data["release_date"];
        $insert_us_theatrical_end = date('Y-m-d', strtotime($Date. ' + 90 days'));
        $insert_comp_query = "INSERT INTO `comparables` SET `title`= '{$movies_detail_data["title"]}', 
            `us_theatrical_release`= '{$movies_detail_data["release_date"]}', 
            `us_gross_bo`= '{$insert_us_gross_bo}', 
            `intl_gross_bo`= '{$insert_intl_gross_bo}',
            `budget`= '{$movies_detail_data["budget"]}',
            `mpaa_rating`= '{$mpaa_certification}',
            `audience_satisfaction`= '{$insert_audience_satisfaction}',
            `us_theatrical_end`= '{$insert_us_theatrical_end}',
            `genre`= '{$movies_detail_data["genres"][0]["name"]}'";
        
        $insert_comp_result = $db -> query($insert_comp_query);
        if($insert_comp_result){
            $insert_comp_id = mysqli_insert_id($db);
        }else{
            throw new Exception('There was an error with the film that you are trying to enter.');
        }

        $insert_poster_query = "INSERT INTO `comparables_images` SET `comparables_id`= '{$insert_comp_id}', 
            `image_url`= 'https://image.tmdb.org/t/p/w600_and_h900_bestv2{$movies_detail_data["poster_path"]}'";

        $insert_poster_result = $db -> query($insert_poster_query);
        if($insert_poster_result){
            $insert_poster_id = mysqli_insert_id($db);
        }else{
            throw new Exception('The poster you were trying to add was not added.');
        }

        $fundingPiece='';

        for($fundingindex=0;$fundingindex<count($movies_detail_data['production_companies']);$fundingindex++){
            $fundingPiece.='("'.$movies_detail_data['production_companies'][$fundingindex]['name'].'")';
            if($fundingindex<count($movies_detail_data['production_companies'])-1){
                $fundingPiece.= ', ';
            }
        }

        $insert_funding_query = "INSERT INTO `funding_partners` (`name`) VALUES
            ".$fundingPiece.";";

        $insert_funding_result = $db -> query($insert_funding_query);
        if($insert_funding_result){
            $fundingNames=' ';

            for($fundingSelectIndex=0;$fundingSelectIndex<count($movies_detail_data['production_companies']);$fundingSelectIndex++){
                $fundingNames.='fp.`name`= "'.$movies_detail_data['production_companies'][$fundingSelectIndex]['name'].'"';
                if($fundingSelectIndex<count($movies_detail_data['production_companies'])-1){
                    $fundingNames.= ' OR ';
                }
            }

            $funding_select_query = 'SELECT fp.`id`, fp.`name`
                            FROM `funding_partners` AS fp
                            WHERE '.$fundingNames.'';

            $funding_select_result=$db->query($funding_select_query);
            $funding_id_array=[];

            while($row_id=$funding_select_result->fetch_assoc()){
                $funding_id_array[]=$row_id['id'];
            }

            $compFundPiece='';

            for($compFundIndex=0;$compFundIndex<count($funding_id_array);$compFundIndex++){
                $compFundPiece.='('.$insert_comp_id.', '.$funding_id_array[$compFundIndex].')';
                if($compFundIndex<count($funding_id_array)-1){
                    $compFundPiece.= ', ';
                }
            }

            $insert_comp_fund_query = "INSERT INTO `comparables_funding` (`comparables_id`, `funding_partners_id`) VALUES
                ".$compFundPiece.";";

            $insert_comp_fund_result = $db -> query($insert_comp_fund_query);
        }else{
            throw new Exception('There was an issue adding funding partners.');
        }

        $insert_distribution_query = "INSERT INTO `distribution_companies` SET `name`= 'Universal Pictures'";

        $insert_distribution_result = $db -> query($insert_distribution_query);
        
        if($insert_distribution_result){
            $insert_distribution_id = mysqli_insert_id($db);
            
            $insert_comp_dist_query = "INSERT INTO `comparables_distribution` (`comparables_id`, `distribution_companies_id`) VALUES
                (".$insert_comp_id.", ".$insert_distribution_id.");";

            $insert_comp_dist_result = $db -> query($insert_comp_dist_query);

            print_r($insert_comp_dist_query);
        }else{
            throw new Exception('The distribution company you were trying to add was not added.');
        }
    }
    // $distribution_title = ' ';

    // $movies_detail_data["title"]
    // $distribution_url = 'https://en.wikipedia.org/api/rest_v1/page/mobile-html/'.$distribution_title.'_film';
    // $distribution_company_name = file_get_contents($distribution_url);
    // $distribution_company_data = json_decode($distribution_company_name);
    // print_r($distribution_company_data);
    // exit(); 
    // $id_array[] = $insert_comp_id; //if everything works you need to make sure to push the comp id to the id array
}

$queryPiece='';

for($index=0;$index<count($id_array);$index++){
    $queryPiece.='c.`id`= '.$id_array[$index];
    if($index<count($id_array)-1){
        $queryPiece.= ' OR ';
    }
}

$query = 'SELECT c.*, fp.`name` AS fp_name, dc.`id` AS dc_id, dc.`name` AS dc_name, GROUP_CONCAT(fp.`id`) AS funding_partners_ids, GROUP_CONCAT(fp.`name`)  AS funding_partners_names, ci.`image_url`
            FROM `comparables` AS c
            JOIN `comparables_funding` AS cf ON cf.`comparables_id` = c.`id`
            JOIN `funding_partners` AS fp ON fp.`id` = cf.`funding_partners_id`
            JOIN `comparables_distribution` AS cd ON cd.`comparables_id` = c.`id`
            JOIN `distribution_companies` AS dc ON dc.`id` = cd.`distribution_companies_id`
            JOIN `comparables_images` AS ci ON ci.`comparables_id` = c.`id`
            WHERE '.$queryPiece.'
            GROUP BY cf.`comparables_id`';

$result = $db->query($query);
$data=[];

if ($result){
    
    if($result -> num_rows===1){
        throw new Exception('One of the comparables does not exist in our database.');
    }

    if ($result -> num_rows > 0) {

        $output['success']=true;


            while($row=$result->fetch_assoc()){
                $row['distribution_companies_info'] = [
                    [
                    'id'=>$row['dc_id'],
                    'name'=>$row['dc_name']
                    ]
                ];
                
                $row['funding_partners_info']=[];
                
                if(strlen($row['funding_partners_ids']) == 1){
                    $row['funding_partners_info'][]=[
                        'id'=>$row['funding_partners_ids'],
                        'name'=>$row['funding_partners_names']
                    ];
                }elseif(strlen($row['funding_partners_ids']) > 1){
                    $id = explode(',',$row['funding_partners_ids']);
                    $name = explode(',',$row['funding_partners_names']);
                    for( $index=0; $index<count($id) ; $index++){
                            $row['funding_partners_info'][]=[
                                'id' => $id[$index],
                                'name'=>$name[$index]
                            ];
                    }
                }
    
                unset($row['funding_partners_ids']);
                unset($row['funding_partners_names']);    
    
                $row['year'] = explode('-',$row['us_theatrical_release'] )[0];
                
                unset($row['fp_id']);
                unset($row['fp_name']);
                unset($row['dc_id']);
                unset($row['dc_name']);
                
                $data[]=$row;
            
            }
    }
} else {
    throw new Exception('SQL Error');
}

$output['data']=$data;

$json_output =json_encode($output);

print($json_output)

?>