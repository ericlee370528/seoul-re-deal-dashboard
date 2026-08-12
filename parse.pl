#!/usr/bin/perl
use strict; use warnings;

open(my $fh, '<:encoding(UTF-8)', 'xl/sharedStrings.xml') or die $!;
local $/;
my $content = <$fh>;
close $fh;

my @sst;
while ($content =~ /<si>(.*?)<\/si>/gs) {
    my $si = $1;
    my $text = '';
    while ($si =~ /<t[^>]*>(.*?)<\/t>/gs) {
        $text .= $1;
    }
    $text =~ s/&amp;/&/g; $text =~ s/&lt;/</g; $text =~ s/&gt;/>/g; $text =~ s/&apos;/'/g; $text =~ s/&quot;/"/g;
    push @sst, $text;
}
print "Total strings: ", scalar(@sst), "\n";

my @targets = ("Ⅰ.영업수익","Ⅲ.영업이익(손실)","Ⅷ.당기순이익(순손실)","지배주주순이익","비지배주주순이익");
my %idx;
for my $i (0..$#sst) {
    for my $t (@targets) {
        if ($sst[$i] eq $t) { $idx{$t} = $i unless exists $idx{$t}; }
    }
}
for my $t (@targets) {
    print "$t => ", (exists $idx{$t} ? $idx{$t} : "NOT FOUND"), "\n";
}
