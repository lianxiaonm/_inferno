#!/usr/bin/env bash

files=`ls ./`;
for i in ${files}
do
    if [ ${i#*.} = "sh" ];
        echo ${i}
        then exit 0;
    fi
done

#for i in $(ls ./)
#    do
#    if [ ${i#*.} = "sh" ];
#        echo ${i}
#        then exit 0;
#    fi
#done
#exit -1;